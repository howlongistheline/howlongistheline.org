import React, { useState, useEffect } from 'react';
import {
  Input,
  SearchInput,
  ListItem,
  ListTitle,
  Button,
  Icon,
  ProgressCircular,
  Checkbox,
  Card,
} from 'react-onsenui';
import { toast } from 'react-toastify';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import { Locations, LocationsIndex } from '../../../api/lines.js';
import MainLayout from '../lib/MainLayout';

function Duplicated({ history, ready, original }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('0'); // 0:not selected
  const [address, setAddress] = useState('');
  const [coord, setCoord] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [selected, setSelected] = useState([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (original != undefined) {
      setSelected([original]);
      setName(original.name);
      setAddress(original.address);
    }
  }, [ready]);

  useEffect(() => {
    const cursor = LocationsIndex.search(search);
    setSearchResult(cursor.fetch());
  }, [search]);

  if (loading || !ready) {
    return (
      <MainLayout>
        <ProgressCircular indeterminate />
      </MainLayout>
    );
  }

  function renderSelected() {
    if (selected == []) {
    } else {
      return selected.map((location) => {
        return renderSelectedCard(location);
      });
    }
  }

  function renderSelectedCard(location) {
    return (
      <ListItem
        tappable
        key={`m${location._id}`}
        onClick={() => {
          if (location._id == original._id) {
            return;
          }
          const index = selected.indexOf(location);
          if (index > -1) {
            const removed = selected.filter((item) => item !== location);
            setSelected(removed);
          }
        }}
      >
        <div className="left">
          {location._id == original._id ? (
            <Icon icon="dot-circle" />
          ) : (
            <Icon icon="fa-minus" />
          )}
        </div>
        <div className="center">
          {`name: ${location.name}`} {` address: ${location.address}`}
        </div>
      </ListItem>
    );
  }

  function renderList() {
    if (search == '') {
    } else {
      return searchResult.map((location) => {
        return renderSearchCard(location);
      });
    }
  }

  function renderSearchCard(location) {
    return (
      <ListItem
        tappable
        key={`s${location._id}`}
        onClick={() => {
          if (location._id == original._id) {
            return;
          }
          if (selected.includes(location)) {
            return;
          }
          const nA = selected.concat([location]);
          setSelected(nA);
          console.log(selected);
        }}
      >
        <div className="left">
          <Icon icon="fa-plus" />
        </div>
        <div className="center">
          {`name: ${location.name}`} {` address: ${location.address}`}
        </div>
      </ListItem>
    );
  }

  function submit() {
    if (selected.length <= 1) {
      toast('Please select more than 1 store');
      return;
    }
    setStep(1);
  }

  function renderCard(location) {
    let Indicator = 'green';
    switch (true) {
      case location.line == undefined:
        Indicator = 'green';
        break;
      case location.line <= 20 && location.line >= 0:
        Indicator = 'green';
        break;
      case location.line <= 35 && location.line > 20:
        Indicator = 'orange';
        break;
      case location.line > 35:
        Indicator = 'red';
        break;
    }
    return (
      <Card key={location._id} style={{ backgroundColor: 'white' }}>
        <ListItem modifier="nodivider">{location.name}</ListItem>
        <ListItem modifier="nodivider">{location.address}</ListItem>
        <ListItem modifier="nodivider">
          <div className="center" style={{ color: Indicator }}>
            There {location.line === 1 ? 'was' : 'were'}{' '}
            {location.line ? location.line : 0}{' '}
            {location.line === 1 ? 'person' : 'people'} in line{' '}
            {moment(location.lastUpdate).fromNow()}.
          </div>
        </ListItem>
      </Card>
    );
  }

  function renderConfirmList() {
    return selected.map((location) => {
      return renderCard(location);
    });
  }

  function renderNameList() {
    return selected.map((location) => {
      return (
        <ListItem
          key={location._id}
          tappable
          onClick={() => {
            setName(location.name);
            setStep(3);
          }}
        >
          <div className="left">{location.name}</div>
          <div className="right">
            <Icon icon="fa-chevron-right" />
          </div>
        </ListItem>
      );
    });
  }

  function renderAddressList() {
    return selected.map((location) => {
      return (
        <ListItem
          key={location._id}
          tappable
          onClick={() => {
            setAddress(location.address);
            setStep(4);
          }}
        >
          <div className="left">{location.address}</div>
          <div className="right">
            <Icon icon="fa-chevron-right" />
          </div>
        </ListItem>
      );
    });
  }

  function renderCoordList() {
    return selected.map((location) => {
      return (
        <ListItem
          key={location._id}
          tappable
          onClick={() => {
            setCoord(location.coordinates);
            setStep(5);
          }}
        >
          <div className="left">
            {/* {location.coordinates} */}
            <img
              src={`https://howlongistheline.org/maps/${location.coordinates[1]},${location.coordinates[0]},K3340`}
            />
          </div>
          <div className="right">
            <Icon icon="fa-chevron-right" />
          </div>
        </ListItem>
      );
    });
  }

  switch (step) {
    case 0:
      return (
        <MainLayout>
          <div style={{ marginBottom: 55 }}>
            <ListItem modifier="nodivider">
              <div className="left">Report Duplicate Stores</div>
              <div className="right">
                <Button
                  onClick={() => {
                    history.push('/');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </ListItem>
            <ListTitle style={{ marginTop: 50 }}>Selected Listings</ListTitle>
            {renderSelected()}
            <ListItem modifier="nodivider">
              Find all other listings that are referring to the same store as
              above. Do not add unrelated stores, even if they are also
              duplicates (of another store).
              <SearchInput
                style={{
                  width: '80%',
                  backgroundColor: '#d9f4ff',
                  color: 'black',
                }}
                placeholder="Type the name of a store or locality to find stores"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </ListItem>
            {renderList()}
          </div>
          <Button
            modifier="large--cta"
            style={{
              position: 'fixed',
              bottom: 0,
              zIndex: 1000,
              minHeight: 50,
            }}
            // type="submit"
            onClick={() => {
              submit();
            }}
          >
            Submit
            <Icon style={{ marginLeft: 10 }} icon="fa-plus" />
          </Button>
        </MainLayout>
      );
    case 1:
      return (
        <MainLayout>
          <div style={{ marginBottom: 55 }}>
            <ListItem modifier="nodivider">
              <div className="left">
                {' '}
                Please verify that these are really all duplicates of the same
                store.{' '}
              </div>
              <div className="right">
                <Button
                  onClick={() => {
                    history.push('/');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </ListItem>
            {renderConfirmList()}
          </div>
          <Button
            modifier="large--cta"
            style={{
              position: 'fixed',
              bottom: 0,
              zIndex: 1000,
              minHeight: 50,
            }}
            // type="submit"
            onClick={() => {
              setStep(2);
            }}
          >
            Confirm
            <Icon style={{ marginLeft: 10 }} icon="fa-plus" />
          </Button>
        </MainLayout>
      );
    case 2:
      return (
        <MainLayout>
          <ListItem modifier="nodivider">
            <div className="left">
              {' '}
              Which is the best name to use for this particular store?
            </div>
            <div className="right">
              <Button
                onClick={() => {
                  history.push('/');
                }}
              >
                Cancel
              </Button>
            </div>
          </ListItem>
          {renderNameList()}
        </MainLayout>
      );
    case 3:
      return (
        <MainLayout>
          <ListItem modifier="nodivider">
            <div className="left">
              {' '}
              Which is the most accurate address for this storev?
            </div>
            <div className="right">
              <Button
                onClick={() => {
                  history.push('/');
                }}
              >
                Cancel
              </Button>
            </div>
          </ListItem>
          {renderAddressList()}
        </MainLayout>
      );
    case 4:
      return (
        <MainLayout>
          <ListItem modifier="nodivider">
            <div className="left">
              {' '}
              Which map below best shows the location of this store?
            </div>
            <div className="right">
              <Button
                onClick={() => {
                  history.push('/');
                }}
              >
                Cancel
              </Button>
            </div>
          </ListItem>
          {renderCoordList()}
        </MainLayout>
      );
    case 5:
      return (
        <MainLayout>
          <div style={{ marginBottom: 55 }}>
            <ListItem modifier="nodivider">
              <div className="left">
                {' '}
                Does everything look ok? Please note that if you are
                intentionally providing misleading information your IP address,
                device fingerprint, and physical location will be published.
              </div>
              <div className="right">
                <Button
                  onClick={() => {
                    history.push('/');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </ListItem>
            <Card style={{ backgroundColor: 'white' }}>
              <ListItem modifier="nodivider">{name}</ListItem>
              <ListItem modifier="nodivider">{address}</ListItem>
              <ListItem modifier="nodivider">
                {/* {coord} */}

                <img
                  src={`https://howlongistheline.org/maps/${coord[1]},${coord[0]},K3340`}
                />
              </ListItem>
            </Card>
          </div>
          <Button
            modifier="large--cta"
            style={{
              position: 'fixed',
              bottom: 0,
              zIndex: 1000,
              minHeight: 50,
            }}
            // type="submit"
            onClick={() => {
              const ids = selected.map((a) => a._id);
              const mostRecentDate = new Date(
                Math.max.apply(
                  null,
                  selected.map((e) => {
                    return new Date(e.lastUpdate);
                  }),
                ),
              );
              const mostRecentObject = selected.filter((e) => {
                const d = new Date(e.lastUpdate);
                return d.getTime() == mostRecentDate.getTime();
              })[0];
              Meteor.call(
                'Locations.merge',
                ids,
                name,
                coord,
                address,
                mostRecentObject.line,
                mostRecentObject.lastUpdate,
                (err, result) => {
                  if (err) {
                    toast(
                      'Some unknown error has occurred, let us know what you were doing and we can probably fix it.',
                    );
                    return;
                  }
                  toast('Thank you! The duplicate listings have been removed!');
                  history.push('/');
                },
              );
            }}
          >
            Confirm
            <Icon style={{ marginLeft: 10 }} icon="fa-plus" />
          </Button>
        </MainLayout>
      );
  }
}

export default withTracker(() => {
  const sub = Meteor.subscribe('locations');
  const ready = sub.ready();
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  return {
    ready,
    original: Locations.findOne({ _id: id }),
  };
})(Duplicated);
