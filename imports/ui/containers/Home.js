/* eslint-disable react/prop-types */

import React, { useEffect, useState, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import {
  getClientLocation,
  isClientLocationRecent,
  mapLocations,
} from '../utils.js';
import Home from '../components/pages/Home.js';
import Locations from '../../api/collections/locations/index.js';

const HomeContainer = ({ history }) => {
  const [clientLocation, setClientLocation] = useCookies(['location']);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isGettingUserLocation, setIsGettingUserLocation] = useState(false);
  const parsedClientLocation = clientLocation?.location
    ? {
        longitude: parseFloat(clientLocation.location.longitude),
        latitude: parseFloat(clientLocation.location.latitude),
      }
    : null;
  const isSearching = !!searchTerm && !_.isArray(searchResult);
  const debouncedSearchHandler = useRef(
    _.debounce((e) => setSearchTerm(e.target.value), 700),
  ).current;

  // Retrieve client's location
  useEffect(() => {
    if (!isClientLocationRecent(clientLocation)) {
      setIsGettingUserLocation(true);
      getClientLocation(
        (position) => {
          setIsGettingUserLocation(false);
          setClientLocation('location', {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            time: new Date(),
          });
        },
        () => {
          setIsGettingUserLocation(false);
        },
      );
    }
  }, [clientLocation]);

  // Retrieve nearest shops
  const { isLoadingNearestLocations, nearestLocations } = useTracker(() => {
    if (isGettingUserLocation || !parsedClientLocation) return {};

    const nearestLocationsSub = Meteor.subscribe(
      'locations.nearby',
      parsedClientLocation,
    );

    if (!nearestLocationsSub.ready())
      return { isLoadingNearestLocations: true };

    return {
      isLoadingNearestLocations: false,
      // XXX TODO Ensure this query returns the expected locations, given that
      // on other pages we're still subscribing to the 'locations' publication
      // containing all locations.
      nearestLocations: Locations.find({}, { limit: 50 }).fetch(),
    };
  }, [isGettingUserLocation, parsedClientLocation]);

  // Handle search
  useEffect(() => {
    if (searchTerm) {
      Meteor.call('locations.search', searchTerm, (error, result) => {
        if (error) toast(error.reason || error.message);
        else setSearchResult(result);
      });
    }
  }, [searchTerm]);

  return (
    <Home
      isGettingUserLocation={isGettingUserLocation}
      isLoadingNearestLocations={isLoadingNearestLocations}
      isSearching={isSearching}
      searchTerm={searchTerm}
      searchResult={mapLocations({ locations: searchResult, history })}
      nearestLocations={mapLocations({ locations: nearestLocations, history })}
      onSetSearchTerm={debouncedSearchHandler}
      onAddLocation={() => history.push('/addLine')}
    />
  );
};

export default HomeContainer;
