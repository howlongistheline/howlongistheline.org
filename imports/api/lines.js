import { Mongo } from 'meteor/mongo';

export const Lines = new Mongo.Collection('lines');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('lines', function tasksPublication() {
      return Lines.find();
    });
}