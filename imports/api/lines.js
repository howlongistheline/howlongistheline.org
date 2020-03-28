import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
export const Lines = new Mongo.Collection('lines');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('lines', function tasksPublication() {
      return Lines.find();
    });
}



Meteor.methods({
    'lines.insert'(name, location, status) {
        check(name, String);
        // check(type, String);
        // check(location, String);
        check(status, String);
        // Make sure the user is logged in before inserting a task
        // if (!this.userId) {
        //     throw new Meteor.Error('not-authorized');
        // }

        Lines.insert({
            name,
            location,
            status,
            createdAt: new Date(),
        });
        return true
    },
})