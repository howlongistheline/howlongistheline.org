import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, ListItem, Card, SearchInput } from 'react-onsenui';
import MainLayout from '../lib/MainLayout';
import ShopListing from '../lib/ShopListing';
import { LocationPropTypesShape } from '../lib/ShopCard';

const Home = ({
  isGettingUserLocation,
  isLoadingNearestLocations,
  isSearching,
  searchTerm,
  searchResult,
  nearestLocations,
  onSetSearchTerm,
  onAddLocation,
}) => {
  return (
    <MainLayout>
      <div
        className="search-container"
        style={{ position: 'sticky', top: 0, zIndex: 1000 }}
      >
        <ListItem>
          <SearchInput
            style={{ width: '80%', backgroundColor: '#d9f4ff', color: 'black' }}
            placeholder="Start typing the name of a store or locality to find things!"
            value={searchTerm}
            onChange={onSetSearchTerm}
          />
        </ListItem>
      </div>

      <div className="border-top" style={{ marginBottom: 55 }}>
        <Card>
          If something doesn't work properly, check back a few days later and it
          will probably be fixed. Go{' '}
          <a href="https://github.com/howlongistheline/howlongistheline.org/issues">
            here
          </a>{' '}
          to see what the community behind this is currently working on.
        </Card>
        <ShopListing
          isGettingUserLocation={isGettingUserLocation}
          isLoadingNearestLocations={isLoadingNearestLocations}
          isSearching={isSearching}
          searchTerm={searchTerm}
          searchResult={searchResult}
          nearestLocations={nearestLocations}
        />
      </div>

      <Button
        modifier="large--cta"
        style={{ position: 'fixed', bottom: 0, zIndex: 1000, minHeight: 50 }}
        // type="submit"
        onClick={onAddLocation}
      >
        Missing store? Add it now!
        <Icon style={{ marginLeft: 10 }} icon="fa-plus" />
      </Button>
    </MainLayout>
  );
};

Home.propTypes = {
  isGettingUserLocation: PropTypes.bool.isRequired,
  isLoadingNearestLocations: PropTypes.bool,
  isSearching: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string,
  searchResult: PropTypes.arrayOf(LocationPropTypesShape).isRequired,
  nearestLocations: PropTypes.arrayOf(LocationPropTypesShape).isRequired,
  onSetSearchTerm: PropTypes.func.isRequired,
  onAddLocation: PropTypes.func.isRequired,
};

Home.defaultProps = {
  searchTerm: '',
  isLoadingNearestLocations: false,
};

export default Home;
