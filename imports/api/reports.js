import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Annotations } from './annotations.js';

var extractions = require('/imports/extractions.json');

export const Reports = new Mongo.Collection('reports');
global.Reports = Reports;


// This code only runs on the server
if (Meteor.isServer) {
  Meteor.publish('reports', function reportsPublication(query, limit) {
    return Reports.find(query, {limit: limit});
  });

  Meteor.methods({
    'reports.serverQuery'(query){
      numReps = Reports.find(query).count();
      return numReps;
    },

    'reports.exportChecked'(key, checkedReports){
      if (key == "ReportID"){
	var checkedKeyValues = checkedReports;
      } else {
        var checkedKeyValues = [];
        for (var ind in checkedReports){
          var report = Reports.find({ReportID: checkedReports[ind]}).fetch()[0];
          if ((report !== undefined) && (!checkedKeyValues.includes(report[key]))){
            checkedKeyValues.push(report[key]);
          }
	}
      }
      var exportReports = [];
      for (var ind in checkedKeyValues){
        exportReports = exportReports.concat(Reports.find({[key]: checkedKeyValues[ind]}).fetch());
      }
      exportReports = exportReports.filter((n) => { return n != undefined });
      return exportReports;
    }
  })
}


Meteor.methods({
  'reports.updateReport'(id, updateObj) {
    Reports.update(id, {
      $set: updateObj
    });
  },

  'reports.unvalidateChecked'(checkedReports){
    for (var ind in checkedReports){
      var report = Reports.find({'ReportID': checkedReports[ind]}).fetch()[0];
      Meteor.call('reports.updateReport', report['_id'], {validatedLabels: []});
    }
  },

  // For each report with at least one validated label, add it to Annotations collection
  'reports.submitAndRemoveValidated'() {
    Reports.find({ $where: "this.validatedLabels.length > 0" }).forEach(
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
        Reports.update(report['_id'], {
          $set: { submittedLabels: report.submittedLabels.concat(report.validatedLabels),
                  validatedLabels: [] }
        });
        // If there are no more unvalidated labels in the current report,
        // remove it from the Reports collection
        var totalExtractionsNum = 0;
        for (var category in extractions){
          totalExtractionsNum += Object.keys(extractions[category]).length;
        }
        console.log(totalExtractionsNum);
        if (report.submittedLabels.concat(report.validatedLabels).length === totalExtractionsNum){
          Reports.remove({ _id: report['_id'] });
        }
      }
    );
  },

  // Remove all unvalidated reports with no validated labels from the Reports collection
  'reports.removeUnvalidated'() {
    Reports.remove({ $where: "this.validatedLabels.length === 0" })
  }
});
