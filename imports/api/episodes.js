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
      return Meteor.call('episodes.fetchReports', key, checkedKeyValues);
    },

    'episodes.fetchReports'(key, keyValues){
      var reports = [];
      for (var ind in keyValues){
        reports = reports.concat(Episodes.find({[key]: keyValues[ind]}).fetch());
      }
      reports = reports.filter((n) => { return n != undefined });
      return reports;
    }
  })
}


Meteor.methods({

});
