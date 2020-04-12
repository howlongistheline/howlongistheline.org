import React, { useEffect, useState } from 'react'
import MainLayout from './MainLayout'
import { withTracker } from 'meteor/react-meteor-data';
import { Locations, LocationsIndex } from '../api/lines.js';
import { Meteor } from 'meteor/meteor';
import { Icon, Button, ListItem, ListTitle, Card, ProgressCircular, SearchInput, ProgressBar } from 'react-onsenui'
import moment from 'moment';
import { Tracker } from 'meteor/tracker'
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import Slider from "@material-ui/core/Slider";

function Index({ history }) {
  {/*Initialise props*/}
  const [clientLocation, setclientLocation] = useCookies(['location']);
  const [nearestShops, setnearestShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    checkClientLocation()
  }, [])

  useEffect(() => {
    let isCancelled = false;
    try {
        if (!isCancelled) {
            Tracker.autorun(function () {
                if (!isCancelled) {
                    if (search == "") {
                    }
                    else {
                        let cursor = LocationsIndex.search(search)
                        setSearchResult(cursor.fetch())
                    }
                }
            })
        }
    } catch (e) {
        if (!isCancelled) {
            throw e;
        }
    }
    return function cleanup() {
        isCancelled = true;
    }
  }, [search])


function checkClientLocation() {
  if (clientLocation.location != undefined) {
    if ((new Date().getTime() - new Date(clientLocation.location.time).getTime()) / 1000 < 300) {
      if (nearestShops.length == undefined || nearestShops.length <= 1) {
        fetchNearestShops()
      } else {
        // console.log(nearestShops)
      }
    } else {getClientLocation()}
  } else {getClientLocation()}
}

function getClientLocation() {
  setLoading(true)
  var options = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 300000
  };

  function success(position) {
      console.log("CLT longitude: ")
      console.log(position.coords.longitude)
      console.log("CLT latitude: ")
      console.log(position.coords.latitude)
    setclientLocation('location', { longitude: position.coords.longitude, latitude: position.coords.latitude, time: new Date() });
    fetchNearestShops(position.coords.latitude, position.coords.longitude);
  }

  function error(err) {
    setLoading(false)
    console.log("nm location failure")
    toast("Can't get current location, please try a different browser if this continues")
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);


  }

  function fetchNearestShops(latitude, longitude) {
      console.log("CLT updating nearest stores")
      var lat;
      var long;
      if(clientLocation.location == undefined){
        lat = latitude;
        long = longitude;
      }else{
        lat = clientLocation.location.latitude;
        long = clientLocation.location.longitude;
      }
      Meteor.call('locations.findnearby', {lat, long}, (err, result) => {
        if (result) {
          // console.log(true)
          setnearestShops(result)
        } else {
          // console.log(false)
          console.log(err)
        }
      }
    );
    setLoading(false)
  }

  function renderList() {
    if(loading){
      return (<Card>
        <ProgressBar indeterminate />
        Getting your location...
    </Card>)
    }
    if(search == ""){
        return nearestShops.map((location) => {
            return renderCard(location)
        }
      )
    }
    else{
      return searchResult.map((location) => {
        return renderCard(location)
    })
    }
  }

  function renderCard(location) {
    var Indicator = "green"
    switch(true){
      case (location.line == undefined):
          Indicator = "green"
          break
      case (location.line <= 20 && location.line >= 0 ):
          Indicator = "green"
          break
      case (location.line <= 35 && location.line > 20 ):
          Indicator = "orange"
          break
      case (location.line > 35 ):
          Indicator = "red"
          break
    }
    var updateNumber = 0;
      return (
          <Card key={location._id} style={{backgroundColor:"white"}}>
              <ListItem modifier="nodivider">
                  {location.name}
              </ListItem>
              <ListItem modifier="nodivider">
                  {location.address}
                  <div className="right">
                  <Button onClick={()=>{history.push('/duplicated?id='+location._id)}}>
                   <i className="fas fa-exclamation-triangle"></i>
                 </Button>
                 </div>
                  {/*<div className="right">
                       }<Button
                      onClick={() => {
                          history.push('/shopDetails?id=' + location._id)
                      }}
                  >More Details</Button>
                  </div> */}
              </ListItem>
              <ListItem modifier="nodivider">
                  <div className="center" style={{color:Indicator}}>
                      There {location.line === 1 ? "was" : "were"} {location.line ? location.line : 0} {location.line === 1 ? "person" : "people"} in line {moment(location.lastUpdate).fromNow()}.
                  </div>
              </ListItem>
              <ListItem modifier="nodivider">
                  <div className="center">
                  If you are at this store right now, drag the slider to update the line numbers, or confirm the existing numbers.
                  </div>
              </ListItem>
              <ListItem modifier="nodivider">
                  <div className="center">
                      0
                      <Slider
                          defaultValue={parseInt(location.line) ? parseInt(location.line) : 0}
                          min={0}
                          max={50}
                          style={{width: "80%", margin: "0px 15px"}}
                          valueLabelDisplay="auto"
                          valueLabelFormat={function displaySliderLabel(value) {
                              return value < 50 ? value : "50+";
                          }}
                          onChangeCommitted={function (event, value) {
                              if (event.type === "mouseup") {
                                  window.document.activeElement.value = value;
                                  document.getElementById(location._id).innerHTML = value;
                                  updateNumber = value;
                              }
                          }}
                      />
                      50+
                  </div>
                  <div className="right">
                  </div>
              </ListItem>
              <ListItem modifier="nodivider">
              <div className="center">
             <Button onClick={
               function() {
                 navigator.geolocation.getCurrentPosition((position) => {
                     Meteor.call('locations.updatelinesize', location._id, position.coords.longitude, position.coords.latitude, updateNumber, function (err, result) {
                       console.log(event.type)
                         if (err) {
                             // toast("Are you at this store right now? Looks like you current location is different with the store's location in our record")
                             history.push("/editLine?id="+location._id+"&lineSize="+updateNumber, {location: location})
                             console.log(err)
                             return
                         }
                         // setLoading(false)
                         alert("The store has been updated, thank you!")
                         history.go(0)
                     });
                 })
               }
             }>
              Update/confirm <i id={location._id}>{location.line}</i> {location.line === 1 ? "person is" : "people are"} waiting in line
              </Button>
              </div>
              </ListItem>
          </Card>
      )
  }

  return (
      <MainLayout>
          <div className="search-container" style={{ position: "sticky", top: 0, zIndex: 1000 }}>
              <ListItem>
                  <SearchInput style={{ width: "80%", backgroundColor: "#d9f4ff", color: "black"}} placeholder="Start typing the name of a store or locality to find things!" onChange={(e) => {
                      setSearch(e.target.value)
                  }} />
              </ListItem>
          </div>
          <div className="border-top" style={{ marginBottom: 55 }}>
                <Card>
                If something doesn't work properly, check back a few days later and it will probably be fixed. Go <a href="https://github.com/howlongistheline/howlongistheline.org/issues">here</a> to see what the community behind this is currently working on.
                </Card>
              <ListTitle>
                  Stores Near You
          </ListTitle>
              {renderList()}
          </div>
          <Button modifier="large--cta" style={{ position: "fixed", bottom: 0, zIndex: 1000, minHeight: 50 }}
              // type="submit"
              onClick={() => { history.push('/addLine') }}>
              Missing store? Add it now!
                  <Icon style={{ marginLeft: 10 }} icon='fa-plus' />
          </Button>
      </MainLayout>
  )
}

export default withTracker(() => {
  Meteor.subscribe('locations');

  return {
      // AllLocations: Locations.find({}, { sort: { lastUpdate: -1 } }).fetch(),
      //   currentUser: Meteor.user,
  };
})(Index);
