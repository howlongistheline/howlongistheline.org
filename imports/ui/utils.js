/* eslint-disable no-console */

import { toast } from 'react-toastify';

export const isClientLocationRecent = (clientLocation) => {
  return (
    clientLocation?.location &&
    (new Date().getTime() - new Date(clientLocation.location.time).getTime()) /
      1000 <
      300
  );
};

export const getClientLocation = (successCallback, errorCallback) => {
  const options = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 300000,
  };

  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log('CLT longitude: ');
      console.log(position.coords.longitude);
      console.log('CLT latitude: ');
      console.log(position.coords.latitude);
      successCallback && successCallback(position);
    },
    (error) => {
      toast(
        "Can't get current location, please try a different browser if this continues",
      );
      console.warn(`ERROR(${error.code}): ${error.message}`);
      errorCallback && errorCallback(error);
    },
    options,
  );
};

export const mapLocations = ({ locations, history }) => {
  if (!locations) return [];

  return locations.map((location) => {
    return {
      _id: location._id,
      name: location.name,
      address: location.address,
      // XXX TODO Enforce line type to number (some locations have 'line' as a string)
      line: parseInt(location.line),
      updatedAt: location.updatedAt,
      onDuplicateReport: () => history.push(`/duplicated?id=${location._id}`),
      onStocksStatusView: () => history.push(`/stocks?id=${location._id}`),
      onLocationLineUpdate: () => {
        navigator.geolocation.getCurrentPosition((position) => {
          Meteor.call(
            'locations.updatelinesize',
            location._id,
            position.coords.longitude,
            position.coords.latitude,
            updateNumber,
            function (err, result) {
              console.log(event.type);

              if (err) {
                // toast("Are you at this store right now? Looks like you current location is different with the store's location in our record")
                history.push(
                  `/editLine?id=${location._id}&lineSize=${updateNumber}`,
                  { location },
                );
                console.log(err);
                return;
              }
              // setLoading(false)
              alert('The store has been updated, thank you!');

              //  history.go(0)
            },
          );
        });
      },
    };
  });
};
