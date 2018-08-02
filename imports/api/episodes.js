import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

var extractions = require('/imports/extractions.json');

export const Episodes = {};

for (const organ in extractions){
  const organ_extractions = extractions[organ];
  Episodes[organ] = new Mongo.Collection(organ+'-episodes');

  // This code only runs on the server
  if (Meteor.isServer) {
    Meteor.publish(organ+'-episodes', function episodesPublication(query, limit) {
      return Episodes[organ].find(query, {limit: limit});
    });
  };
}

if (Meteor.isServer) {

  Meteor.methods({
    'episodes.serverQuery'(organ, query){
      numReps = Episodes[organ].find(query).count();
      return numReps;
    },

    'episodes.fetchReports'(organ, key, keyValues){
      var reports = Reports[organ].find({[key]: { $in: keyValues}}).fetch();
      reports = reports.filter((n) => { return n != undefined });
      return reports;
    }
  })
}
