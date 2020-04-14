import React, { useState, useEffect } from 'react';
import {
  Input,
  Select,
  ListItem,
  ListTitle,
  Button,
  Icon,
  ProgressCircular,
  Checkbox,
} from 'react-onsenui';
import { toast } from 'react-toastify';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import { Locations, Additionals, LocationsIndex } from '../../../api/lines.js';
import MainLayout from '../lib/MainLayout';

function Stocks({ details, additional, history }) {
  if (!details || !additional) {
    return (
      <MainLayout>
        <ProgressCircular indeterminate />
      </MainLayout>
    );
  }

  const [itemName, setItemName] = useState('');

  function renderStocks() {
    if (additional.outofStock == undefined) {
      return <ListItem>No data for this shop right now</ListItem>;
    }
    const stocks = additional.outofStock.sort((a, b) => a.time - b.time);
    return stocks.reverse().map((stock, idx) => {
      return (
        <ListItem key={idx}>
          {stock.name} is out of stock
          <div className="right">{moment(stock.time).fromNow()}</div>
        </ListItem>
      );
    });
  }

  function addStock() {
    if (itemName == '') {
      toast('please enter the item Name');
      console.log(err);
      return;
    }
    Meteor.call('Outofstock.insert', details._id, itemName, (err, result) => {
      if (err) {
        toast('an error occurred when adding the comment');
        return;
      }
      toast('success!');
      setItemName('');
    });
  }

  return (
    <MainLayout>
      <div style={{ marginBottom: 55 }}>
        <ListTitle>Store Details</ListTitle>
        <ListItem modifier="nodivider">{details.name}</ListItem>
        <ListTitle />
        <ListItem modifier="nodivider">{details.address}</ListItem>
        <ListTitle style={{ marginTop: 30 }}>Stocks Status:</ListTitle>
        <ListItem>
          <Input
            style={{ width: '80%' }}
            value={itemName}
            float
            onChange={(event) => {
              setItemName(event.target.value);
            }}
            modifier="material"
            placeholder="Anything is out of stocks?"
          />
          <div className="right">
            <Button
              onClick={() => {
                addStock();
              }}
            >
              <Icon icon="fa-send" />
            </Button>
          </div>
        </ListItem>
        {renderStocks()}
      </div>
    </MainLayout>
  );
}

export default withTracker(() => {
  Meteor.subscribe('locations');
  Meteor.subscribe('additionals');
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  return {
    details: Locations.findOne({ _id: id }),
    additional: Additionals.findOne({ locationId: id }),
  };
})(Stocks);
