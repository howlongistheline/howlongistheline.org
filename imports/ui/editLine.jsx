import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Icon, Button, ListItem, ListTitle, Card, ProgressCircular, SearchInput, ProgressBar, Range } from 'react-onsenui'
import { toast } from 'react-toastify';
import { withTracker } from 'meteor/react-meteor-data';
import { Locations } from '../api/lines.js';
import moment from 'moment';

function EditLine({ history, details }) {

    if (!details) {
        return (
            <MainLayout>
                <ProgressCircular indeterminate />
            </MainLayout>
        )
    }
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(details.status); //0:not selected
    const [lineSize, setLineSize] = useState(parseInt(new URLSearchParams(window.location.search).get('lineSize')))

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
          return (
              <Card key={location._id} style={{backgroundColor:"white"}}>
                  <ListItem modifier="nodivider">
                      {location.name}
                  </ListItem>
                  <ListItem modifier="nodivider">
                      {location.address}
                      {/*<div className="right">
                           }<Button
                          onClick={() => {
                              history.push('/shopDetails?id=' + location._id)
                          }}
                      >More Details</Button>
                      </div> */}
                  </ListItem>
                  <ListItem modifier="nodivider">
                      <div className="center"  style={{color:Indicator}}>There were {location.line ? location.line : 0} people in line {moment(location.lastUpdate).fromNow()}. </div>
                      <div className="right">
                      </div>
                  </ListItem>
                  <ListItem modifier="nodivider">
                  <div className="center">
                  0
                  <Range modifier="material" style={{width:"80%"}} min={0} max={50} value={lineSize}
                  onChange={ function(event) {
                      setLineSize(parseInt(event.target.value))
                  }}
                  />
                  50+
                  </div>
                  </ListItem>
                  <ListItem modifier="nodivider">
                  <div className="center">If you are at this store, drag the slider above to update the number of people waiting in line right now.</div>
                  </ListItem>
              </Card>
          )
      }

    function submit() {

        if (status == "0") {
            toast("How busy is it right now?");
            return
        }

        setLoading(true)
        navigator.geolocation.getCurrentPosition((position) => {
            Meteor.call('locations.forceUpdatelinesize', details._id, position.coords.longitude, position.coords.latitude, lineSize, function (err, result) {
                if (err) {
                    toast("Some Error happens")
                    return
                }
                // setLoading(false)
                alert("The shop has been updated, thank you!")
                history.push('/')
            });
        }, error)

        function error(err) {
            toast("Cant get current location, please turn on browser's geolocation function or try a different browser")
            setLoading(false)
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }
    }
    if (loading) {
        return (
            <MainLayout>
                <ProgressCircular indeterminate />
            </MainLayout>
        )
    }
    return (
        <MainLayout>
            <div style={{ marginBottom: 55 }}>
                <Card>
                Are you really at this location? It appears that either you are not at the shop, or we have the wrong coordinates for the shop.
                </Card>
                <Card>
                If you are not at this shop right now: ask your friends on facebook etc to update this shop for you whenever they go.
                </Card>
                <Card onClick={()=>{console.log(123)}}>
                If you are at this shop right now, please submit to reset the location.
                </Card>
                {renderCard(details)}
            </div>
            <Button modifier="large--cta" style={{ position: "fixed", bottom: 0, zIndex: 1000, minHeight: 50 }}
                // type="submit"
                onClick={() => {
                    submit()
                }}>
                Submit
                    <Icon style={{ marginLeft: 10 }} icon='fa-plus' />
            </Button>
        </MainLayout>
    )
}


export default withTracker(() => {
    Meteor.subscribe('locations');
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')
    return {
        details: Locations.findOne({ _id: id }),
    };
})(EditLine);
