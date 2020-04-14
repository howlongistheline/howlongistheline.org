import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { Card, ProgressBar, ListTitle } from 'react-onsenui';
import ShopCard, { LocationPropTypesShape } from './ShopCard';

const ShopListing = ({
  isGettingUserLocation,
  isLoadingNearestLocations,
  isSearching,
  searchTerm,
  searchResult,
  nearestLocations,
}) => {
  const ShopCardMapFn = (location) => (
    <ShopCard key={location._id} location={location} />
  );

  if (isGettingUserLocation || isLoadingNearestLocations || isSearching) {
    return (
      <Card>
        <ProgressBar indeterminate />
        {isGettingUserLocation
          ? 'Getting your location...'
          : isLoadingNearestLocations
          ? 'Loading nearby stores...'
          : 'Searching stores...'}
      </Card>
    );
  }

  if (searchTerm) {
    return (
      <React.Fragment>
        <ListTitle>Search Result</ListTitle>
        {_.isEmpty(searchResult) ? (
          <Card>
            <p>We cannot find the store you are looking for.</p>
          </Card>
        ) : (
          searchResult.map(ShopCardMapFn)
        )}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <ListTitle>Stores Near You</ListTitle>
      {_.isEmpty(nearestLocations) ? (
        <Card>
          <p>There is currently no store near you.</p>
        </Card>
      ) : (
        nearestLocations.map(ShopCardMapFn)
      )}
    </React.Fragment>
  );
};

ShopListing.propTypes = {
  isGettingUserLocation: PropTypes.bool.isRequired,
  isLoadingNearestLocations: PropTypes.bool.isRequired,
  isSearching: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string,
  searchResult: PropTypes.arrayOf(LocationPropTypesShape).isRequired,
  nearestLocations: PropTypes.arrayOf(LocationPropTypesShape).isRequired,
};

ShopListing.defaultProps = {
  searchTerm: '',
};

export default ShopListing;
