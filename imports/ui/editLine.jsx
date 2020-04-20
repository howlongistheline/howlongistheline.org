import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Icon, Button, ListItem, ListTitle, Card, ProgressCircular, SearchInput, ProgressBar } from 'react-onsenui'
import { toast } from 'react-toastify';
import { withTracker } from 'meteor/react-meteor-data';
import { Locations } from '../api/lines.js';
import moment from 'moment';
import Slider from "@material-ui/core/Slider";
import {getDisplayedLineLength, MAX_LINE_LENGTH} from "./Util";

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
                  <ListItem style={{fontSize: 20, fontWeight: "bold"}} modifier="nodivider">
                      {location.name}
                  </ListItem>
                  <ListItem modifier="nodivider">
                      {location.address}
                  </ListItem>
                  <ListItem modifier="nodivider">
                      <div className="center" style={{color:Indicator}}>
                          There {location.line === 1 ? "was" : "were"} {getDisplayedLineLength(location.line)} {location.line === 1 ? "person" : "people"} in line {moment(location.lastUpdate).fromNow()}.
                      </div>
                      <div className="right">
                      </div>
                  </ListItem>
                  <ListItem modifier="nodivider">
                      <div className="center">
                          <Slider
                              defaultValue={parseInt(lineSize) ? parseInt(lineSize) : 0}
                              min={0}
                              max={MAX_LINE_LENGTH}
                              style={{width: "80%", margin: "0px 15px"}}
                              valueLabelDisplay="auto"
                              valueLabelFormat={getDisplayedLineLength}
                              onChangeCommitted={function (event, value) {
                                  if (event.type === "mouseup" || event.type==="touchend") {
                                      setLineSize(value)
                                  }
                              }}
                          />
                      </div>
                  </ListItem>
                  <ListItem modifier="nodivider">
                  <div className="center">
                      Press Submit below to confirm that you are at the store, and there {lineSize === 1 ? "is" : "are"} {getDisplayedLineLength(lineSize)} {lineSize === 1 ? "person" : "people"} in line right now.
                  </div>
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
        var options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        };
        navigator.geolocation.getCurrentPosition((position) => {
            Meteor.call('locations.forceUpdatelinesize', details._id, position.coords.longitude, position.coords.latitude, lineSize, function (err, result) {
                if (err) {
                    toast("An error happened.")
                    return
                }
                // setLoading(false)
                alert("The store has been updated, thank you!")
                history.push('/')
            });
        }, error, options)

        function error(err) {
            toast("Can't get current location, please turn on browser's geolocation function or try a different browser")
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
                <Card class="isa_warning">
                    <i className="fa fa-warning"/> Are you really at this location?
                    It appears that either you are not at the store, or we have the wrong coordinates for the store.
                </Card>
                <Card class="isa_info">
                    <i className="fas fa-info-circle"/> If you are not at this store right now: ask your friends to update this store for you whenever they go.
                </Card>
                <Card class="isa_info" onClick={()=>{console.log(123)}}>
                    <i className="fas fa-info-circle"/> If you are at this store right now, please submit to reset the location.
                    If you are intentionally providing misleading information your IP address, device fingerprint, and physical location will be published.
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
