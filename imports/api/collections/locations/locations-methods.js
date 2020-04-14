import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Locations from '.';

Meteor.methods({
  'locations.search'(searchTerm) {
    check(searchTerm, String);
    return Locations.find({ $text: { $search: searchTerm } }).fetch();
  },
});
