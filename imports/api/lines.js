import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Index, MinimongoEngine } from 'meteor/easy:search'

Locations = new Mongo.Collection('locations');
Additionals = new Mongo.Collection('additionals');

export { Locations, Additionals }

export const LocationsIndex = new Index({
    collection: Locations,
    fields: ['name', 'address'],
    engine: new MinimongoEngine(),
})


if (Meteor.isServer) {
    // This code only runs on the server
    Locations._ensureIndex({ "coordinates": "2dsphere" })
    Meteor.publish('locations', function tasksPublication() {
        return Locations.find();
    });
    Meteor.publish('additionals', function tasksPublication() {
        return Additionals.find();
    });
}

function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
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

        Locations.insert({
            name,
            "type": "Point",
            "coordinates": location,
            status,
            address,
            upvote: 0,
            createdAt: new Date(),
            lastUpdate: new Date(),
        }, (err, id) => {
            Additionals.insert({
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

        var loc = Locations.findOne({
            _id: id
        })
        var distanceInMeter = distance(loc.coordinates[1], loc.coordinates[0], lat, long, "K") * 1000
        if (distanceInMeter > 100) {
            throw new Meteor.Error('You do not appear to be at this location right now');
        }

        Locations.update({ _id: id },
            {
                $set:
                {
                    status,
                    upvote: 0,
                    lastUpdate: new Date(),
                }
            });

        Additionals.update({ locationId: id }, {
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

        Additionals.update({ locationId: id }, {
            $push: { comments: { comment: comment, time: new Date() } }
        })

        return true
    },
    'locations.findnearby': function(coords, long) {
      if (!Meteor.isServer) { console.log("Fetching data from server")
      } else if (Meteor.isServer) {
      console.log("SRV coords")
      console.log(coords)
      var parsedLong = 0;
      var parsedLat = 0;
      parsedLong = parseFloat(coords.long);
      parsedLat = parseFloat(coords.lat);
      if (!parsedLong && !parsedLat) {
        console.log("Changing to different coordinate object");
        parsedLong = parseFloat(coords);
        parsedLat = parseFloat(long);
        console.log("NEW COORDS");
        console.log(parsedLat, parsedLong);
      }
        return (
          Locations.find({
            "coordinates": {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parsedLong, parsedLat]
                    },
                }
            }
        }, {limit: 50 }).fetch()
      )
    }},
    'locations.upvote'(id) {
        Locations.update(
            { _id: id },
            { $inc: { upvote: 1 } }
        )
    },

    'locations.updatelinesize'(id, long, lat, line) {
      var loc = Locations.findOne({
          _id: id
      })
      var distanceInMeter = distance(loc.coordinates[1], loc.coordinates[0], lat, long, "K") * 1000
      if (distanceInMeter > 100) {
          throw new Meteor.Error('You do not appear to be at this shop right now');
      }
      Locations.update({ _id: id },
        {
          $set:
          {
            line: line,
            lastUpdate: new Date()
          }
        }
      )
      Additionals.update({ locationId: id }, {
          $push: { history: { line: line, time: new Date() } }
      })
    },

    'locations.forceUpdatelinesize'(id, long, lat, line) {
        var loc = Locations.findOne({
            _id: id
        })

        Additionals.update({ locationId: id }, {
            $push: { coordinatesHistory: { coordinates: loc.coordinates, time: new Date() } }
        })

        Locations.update({ _id: id },
          {
            $set:
            {
              coordinates: [long, lat],
              line: line,
              lastUpdate: new Date()
            }
          }
        )
      },

    'Locations.updateOperatingtime'(id, opening, closing) {
        Locations.update({ _id: id },
            {
                $set:
                {
                    opening,
                    closing
                }
            });
    },
})
