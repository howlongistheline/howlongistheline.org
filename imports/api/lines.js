import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Index, MinimongoEngine } from 'meteor/easy:search'

export const locations = new Mongo.Collection('locations');
export const additionals = new Mongo.Collection('additionals');

export const locationsIndex = new Index({
    collection: locations,
    fields: ['name', 'address'],
    engine: new MinimongoEngine(),
})


if (Meteor.isServer) {
    // This code only runs on the server
    locations._ensureIndex({ "coordinates": "2dsphere" })
    Meteor.publish('locations', function tasksPublication() {
        return locations.find();
    });
    Meteor.publish('additionals', function tasksPublication() {
        return additionals.find();
    });
}

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}


Meteor.methods({
    'locations.insert'(name, location, address, status) {
        check(name, String);
        check(status, String);
        check(address, String);
        if (location == undefined) {
            throw new Meteor.Error("location is undefined")
        }
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
        }, (err, id) => {
            additionals.insert({
                locationId: id,
                history: [{ status: status, time: new Date() }],
                comments: []
            })
        });

        return true
    },
    'locations.update'(id, status, long, lat) {
        check(status, String);
        // Make sure the user is logged in before inserting a task
        // if (!this.userId) {
        //     throw new Meteor.Error('not-authorized');
        // }

        var loc = locations.findOne({
            _id: id
        })

        if(distance(loc.coordinates[1],loc.coordinates[0], lat, long, "M")> 100){
            throw new Meteor.Error('You do not appear to be at this location right now');
        }

        locations.update({ _id: id },
            {
                $set:
                {
                    status,
                    upvote: 0,
                    lastUpdate: new Date(),
                }
            });

        additionals.update({ locationId: id }, {
            $push: { history: { status: status, time: new Date() } }
        })
        return true
    },
    'locations.comment'(id, comment) {
        check(comment, String);
        // Make sure the user is logged in before inserting a task
        // if (!this.userId) {
        //     throw new Meteor.Error('not-authorized');
        // }

        additionals.update({ locationId: id }, {
            $push: { comments: { comment: comment, time: new Date() } }
        })

        return true
    },
    'locations.findnearby'(long, lat) {
        var locs = locations.find({
            "coordinates": {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [long, lat],
                        $maxDistance: 10
                    },
                }
            }
        }, { limit: 3 }).fetch()

        return locs
    },
    'locations.upvote'(id) {
        locations.update(
            { _id: id },
            { $inc: { upvote: 1 } }
        )
    }
})
