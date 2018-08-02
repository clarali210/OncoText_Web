import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Annotations } from './annotations.js';

var extractions = require('/imports/extractions.json');

export const Reports = {};

for (const organ in extractions){
  const organ_extractions = extractions[organ];
  Reports[organ] = new Mongo.Collection(organ+'-reports');

  // This code only runs on the server
  if (Meteor.isServer) {
    Meteor.publish(organ+'-reports', function reportsPublication(query, limit) {
      return Reports[organ].find(query, {limit: limit});
    });
  };
}

if (Meteor.isServer) {

  Meteor.methods({
    'reports.serverQuery'(organ, query){
      numReps = Reports[organ].find(query).count();
      return numReps;
    },

    'reports.fetchReports'(organ, key, keyValues){
      var reports = Reports[organ].find({[key]: {$in: keyValues}}).fetch();
      reports = reports.filter((n) => { return n != undefined });
      return reports;
    }
  })
}

Meteor.methods({
  'reports.updateReport'(organ, id, updateObj) {
    Reports[organ].update(id, {
      $set: updateObj
    });
  },

  // For each report with at least one validated label, add it to Annotations collection
  'reports.submitAndRemoveValidated'(organ) {
    var reports = Reports[organ].find({ $where: "this.validatedLabels.length > 0" }).fetch();
    reports.forEach(
      function(report){
        // For each validated label, add its value to the corresponding new report
        var rep = {
          "new": true,
          ReportID: report["ReportID"],
          Report_Text: report["Report_Text"],
          Report_Text_Segmented: report['Report_Text_Segmented'],
          MRNPlusX: report['MRNPlusX'],
          Institution: report['Institution'],
          Report_Date_Time: report['Report_Date_Time'],
          EMPI: report['EMPI'],
          filename: report['filename'],
          _id: report['_id']
        };
        for (var ind in report.validatedLabels){
          rep[report.validatedLabels[ind]] = report[report.validatedLabels[ind]];
        }

        // If this report was previously submitted, find it in the Annotations collection
        if (report["submittedLabels"].length > 0){
          // var current = Annotations.find({ Report_Text_Segmented: report["Report_Text_Segmented"] }).fetch()[0];
          Annotations.update(report['_id'], {
            $set: rep
          });
        }
        // If it was not previously submitted, make a new report item in the Annotations collection
        else{
          Annotations.insert(rep);
        }

        // Add the newly submitted labels to submittedLabels
        // and clear the array of validatedLabels from the current report in Reports
        Reports[organ].update(report['_id'], {
          $set: { submittedLabels: report.submittedLabels.concat(report.validatedLabels),
                  validatedLabels: [] }
        });
        // If there are no more unvalidated labels in the current report,
        // remove it from the Reports collection
        var totalExtractionsNum = 0;
        for (var category in organ_extractions){
          totalExtractionsNum += Object.keys(organ_extractions[category]).length;
        }
        console.log(totalExtractionsNum);
        if (report.submittedLabels.concat(report.validatedLabels).length === totalExtractionsNum){
          Reports[organ].remove({ _id: report['_id'] });
        }
      }
    );
  },

  // Remove all unvalidated reports with no validated labels from the Reports collection
  'reports.removeUnvalidated'(organ) {
    Reports[organ].remove({ $where: "this.validatedLabels.length === 0" })
  }
})
