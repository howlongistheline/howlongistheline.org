import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Locations from '../collections/locations';

const NUMBER_OF_NEARBY_LOCATIONS = 50;

Meteor.publish('locations.nearby', (coords) => {
  check(coords, {
    longitude: Number,
    latitude: Number,
  });

  return Locations.find(
    {
      coordinates: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [coords.longitude, coords.latitude],
          },
        },
      },
    },
    {
      limit: NUMBER_OF_NEARBY_LOCATIONS,
    },
  );
});
