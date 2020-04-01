import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Index, MinimongoEngine } from 'meteor/easy:search'

export const feedbacks = new Mongo.Collection('feedbacks');


if (Meteor.isServer) {
    // This code only runs on the server

}

Meteor.methods({
    'feedbacks.insert'(feedback) {
        check(feedback, String);
        // Make sure the user is logged in before inserting a task
        // if (!this.userId) {
        //     throw new Meteor.Error('not-authorized');
        // }

        feedbacks.insert({
            feedback,
            createdAt: new Date(),
        });

        return true
    },
})
