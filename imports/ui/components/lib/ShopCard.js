import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Slider from '@material-ui/core/Slider';
import { Button, ListItem, Card } from 'react-onsenui';

const ShopCard = ({ location }) => {
  let indicatorColor = 'green';
  switch (true) {
    case location.line === undefined:
      indicatorColor = 'green';
      break;
    case location.line <= 20 && location.line >= 0:
      indicatorColor = 'green';
      break;
    case location.line <= 35 && location.line > 20:
      indicatorColor = 'orange';
      break;
    case location.line > 35:
      indicatorColor = 'red';
      break;
    default:
  }

  return (
    <Card key={location._id} style={{ backgroundColor: 'white' }}>
      <ListItem
        style={{ fontSize: 20, fontWeight: 'bold' }}
        modifier="nodivider"
      >
        {location.name}
        <div className="right">
          <Button onClick={location.onDuplicateReport}>
            <i className="fas fa-exclamation-triangle" />
          </Button>
        </div>
      </ListItem>
      <ListItem modifier="nodivider">{location.address}</ListItem>
      <ListItem modifier="nodivider">
        <div className="center" style={{ color: indicatorColor }}>
          There {location.line === 1 ? 'was' : 'were'}{' '}
          {location.line ? location.line : 0}{' '}
          {location.line === 1 ? 'person' : 'people'} in line{' '}
          {moment(location.updatedAt).fromNow()}.
        </div>
        <div className="right">
          <Button onClick={location.onStocksStatusView}>Stocks Status</Button>
        </div>
      </ListItem>
      <ListItem modifier="nodivider">
        <div className="center">
          If you are at this store right now, drag the slider to update the line
          numbers, or confirm the existing numbers.
        </div>
      </ListItem>
      <ListItem modifier="nodivider">
        <div className="center">
          <Slider
            defaultValue={location.line || 0}
            min={0}
            max={50}
            style={{ width: '80%', margin: '0px 15px' }}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => {
              return value < 50 ? value : '50+';
            }}
            onChangeCommitted={(event, value) => {
              if (event.type === 'mouseup' || event.type === 'touchend') {
                window.document.activeElement.value = value;
                document.getElementById(location._id).innerHTML = value;
              }
            }}
          />
        </div>
        <div className="right" />
      </ListItem>
      <ListItem modifier="nodivider">
        <div className="center">
          <Button onClick={location.onLocationLineUpdate}>
            Update/confirm <i id={location._id}>{location.line}</i>{' '}
            {location.line === 1 ? 'person is' : 'people are'} waiting in line
          </Button>
        </div>
      </ListItem>
    </Card>
  );
};

export const LocationPropTypesShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  line: PropTypes.number,
  updatedAt: PropTypes.instanceOf(Date),
  onDuplicateReport: PropTypes.func.isRequired,
  onStocksStatusView: PropTypes.func.isRequired,
  onLocationLineUpdate: PropTypes.func.isRequired,
});

ShopCard.propTypes = {
  location: LocationPropTypesShape.isRequired,
};

export default ShopCard;
