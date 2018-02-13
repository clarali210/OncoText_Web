import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

var extractions = require('/imports/extractions.json');

export const Episodes = new Mongo.Collection('episodes');
global.Episodes = Episodes;


// This code only runs on the server
if (Meteor.isServer) {
  Meteor.publish('episodes', function episodesPublication(query, limit) {
    return Episodes.find(query, {limit: limit});
  });

  Meteor.methods({
    'episodes.serverQuery'(query){
      numReps = Episodes.find(query).count();
      return numReps;
    },

    'episodes.exportChecked'(key, checkedReports){
      if (key == "ReportID"){
	var checkedKeyValues = checkedReports;
      } else {
        var checkedKeyValues = [];
        for (var ind in checkedReports){
          var report = Episodes.find({ReportID: checkedReports[ind]}).fetch()[0];
          if ((report !== undefined) && (!checkedKeyValues.includes(report[key]))){
            checkedKeyValues.push(report[key]);
          }
	}
      }
      var exportReports = [];
      for (var ind in checkedKeyValues){
        exportReports = exportReports.concat(Episodes.find({[key]: checkedKeyValues[ind]}).fetch());
      }
      exportReports = exportReports.filter((n) => { return n != undefined });
      return exportReports;
    }
  })
}


Meteor.methods({

});
