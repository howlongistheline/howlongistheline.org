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
import { TimePicker } from '@material-ui/pickers';
import { Additionals, LocationsIndex } from '../../../api/lines.js';
import MainLayout from '../lib/MainLayout';
import Locations from '../../../api/collections/locations/index.js';

function ShopDetails({ details, additional, comments, historys, history }) {
  if (!details || !additional) {
    return (
      <MainLayout>
        <ProgressCircular indeterminate />
      </MainLayout>
    );
  }

  const [comment, setComment] = useState('');
  const [opening, setOpening] = useState();
  const [closing, setClosing] = useState();
  const [openingTime, setOpeningTime] = useState([]);
  const [closingTime, setClosingTime] = useState([]);

  useEffect(() => {
    if (details.opening && details.closing) {
      var d = new Date(
        Date.UTC(96, 1, 2, [details.opening[0]], [details.opening[1]], 5),
      );
      setOpening(d);
      setOpeningTime([d.getUTCHours(), d.getUTCMinutes()]);
      var d = new Date(
        Date.UTC(96, 1, 2, [details.closing[0]], [details.closing[1]], 5),
      );
      setClosing(d);
      setClosingTime([d.getUTCHours(), d.getUTCMinutes()]);
    }
    return () => {};
  }, []);

  function statusToWord(statusCode) {
    switch (statusCode) {
      case 'no':
        return <div style={{ color: 'green' }}>No Lines!</div>;
      case 'small':
        return <div style={{ color: 'orange' }}>A Wee Wait</div>;
      case 'long':
        return <div style={{ color: 'red' }}>Busy. Stay Home.</div>;
    }
  }

  function UpdateTime() {
    if (openingTime == []) {
      toast('please select an opening time!');
      return;
    }
    if (closingTime == []) {
      toast('please select a closing time!');
      return;
    }
    Meteor.call(
      'Locations.updateOperatingtime',
      details._id,
      openingTime,
      closingTime,
      (err, result) => {
        if (err) {
          toast('an error occurred!');
          console.log(err);
          return;
        }
        toast('success!');
      },
    );
  }

  function addComment() {
    if (comment == '') {
      toast('please enter a comment');
      console.log(err);
      return;
    }
    Meteor.call('locations.comment', details._id, comment, (err, result) => {
      if (err) {
        toast('an error occurred when adding the comment');
        return;
      }
      toast('success!');
      setComment('');
    });
  }

  function renderComments() {
    return comments.map((comment, idx) => {
      return (
        <ListItem key={idx}>
          {comment.comment}
          <div className="right">{moment(comment.time).fromNow()}</div>
        </ListItem>
      );
    });
  }

  function renderHistorys() {
    return historys.map((history, idx) => {
      return (
        <ListItem key={idx}>
          {statusToWord(history.status)}
          <div className="right">{moment(history.time).fromNow()}</div>
        </ListItem>
      );
    });
  }

  return (
    <MainLayout>
      <div style={{ marginBottom: 55 }}>
        <ListTitle>Store Details</ListTitle>
        <ListItem modifier="nodivider">{details.name}</ListItem>
        <ListTitle />
        <ListItem modifier="nodivider">{details.address}</ListItem>
        <ListTitle>Line Status: {statusToWord(details.status)}</ListTitle>
        <ListItem>
          <div className="left">
            <TimePicker
              style={{ paddingLeft: 15 }}
              label="Opening time:"
              clearable
              ampm={false}
              value={opening}
              onChange={(e) => {
                setOpening(e._d);
                setOpeningTime([e._d.getUTCHours(), e._d.getUTCMinutes()]);
              }}
            />
          </div>
          <div className="center">
            <TimePicker
              style={{ paddingLeft: 15 }}
              label="Closing time:"
              clearable
              ampm={false}
              value={closing}
              onChange={(e) => {
                setClosing(e._d);
                setClosingTime([e._d.getUTCHours(), e._d.getUTCMinutes()]);
              }}
            />
          </div>
          <div className="right">
            <Button
              onClick={() => {
                UpdateTime();
              }}
            >
              <Icon icon="fa-send" />
            </Button>
          </div>
        </ListItem>
        <ListTitle style={{ marginTop: 30 }}>Comments:</ListTitle>
        <ListItem>
          <Input
            style={{ width: '80%' }}
            value={comment}
            float
            onChange={(event) => {
              setComment(event.target.value);
            }}
            modifier="material"
            placeholder="leave your comment"
          />
          <div className="right">
            <Button
              onClick={() => {
                addComment();
              }}
            >
              <Icon icon="fa-send" />
            </Button>
          </div>
        </ListItem>
        {renderComments()}
        <ListTitle style={{ marginTop: 30 }}>Historys:</ListTitle>
        {renderHistorys()}
      </div>
    </MainLayout>
  );
}

export default withTracker(() => {
  Meteor.subscribe('locations');
  Meteor.subscribe('additionals');
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (Additionals.findOne({ locationId: id })) {
    return {
      details: Locations.findOne({ _id: id }),
      additional: Additionals.findOne({ locationId: id }),
      comments: Additionals.findOne({ locationId: id }).comments.reverse(),
      historys: Additionals.findOne({ locationId: id }).history.reverse(),
    };
  }
  return {
    details: Locations.findOne({ _id: id }),
    additional: Additionals.findOne({ locationId: id }),
  };
})(ShopDetails);
