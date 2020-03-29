import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Index, MinimongoEngine } from 'meteor/easy:search'

export const locations = new Mongo.Collection('locations');

export const locationsIndex = new Index({
    collection: locations,
    fields: ['name', 'address'],
    engine: new MinimongoEngine(),
})


if (Meteor.isServer) {
    // This code only runs on the server
    locations._ensureIndex( { "coordinates" : "2dsphere" } )
    Meteor.publish('locations', function tasksPublication() {
      return locations.find();
    });
}



Meteor.methods({
    'locations.insert'(name, location, address, status) {
        check(name, String);
        check(status, String);
        check(address, String);
        // Make sure the user is logged in before inserting a task
        // if (!this.userId) {
        //     throw new Meteor.Error('not-authorized');
        // }

        locations.insert({
            name,
            "type": "Point",
            "coordinates": location,
            status,
            address,
            upvote: 0,
            createdAt: new Date(),
            lastUpdate: new Date(),
        });
        return true
    },    
    'locations.update'(id, name, address, status) {
        check(name, String);
        check(status, String);
        check(address, String);
        // Make sure the user is logged in before inserting a task
        // if (!this.userId) {
        //     throw new Meteor.Error('not-authorized');
        // }
        locations.update({_id: id},{
            name,
            status,
            address,
            upvote: 0,
            lastUpdate: new Date(),
        });
        return true
    },
    'locations.findnearby'(long, lat){
            var locs = locations.find({ 
                "coordinates": {
                    $near: {
                        $geometry: {
                            type: "Point", 
                            coordinates: [long, lat] ,
                            $maxDistance : 10
                        },
                    }
                } 
            },{limit: 3}).fetch()
            return locs
    },
    'locations.upvote' (id){
        locations.update(
            { _id: id },
            { $inc: { upvote: 1} }
        )
    }
})
