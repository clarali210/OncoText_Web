import { Mongo } from 'meteor/mongo';

export const Annotations = new Mongo.Collection('annotations');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('annotations', function annotationsPublication() {
    return Annotations.find();
  });
}
