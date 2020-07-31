import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Icon, Button, ListItem, ListTitle, Card, ProgressCircular, SearchInput, ProgressBar } from 'react-onsenui'
import { toast } from 'react-toastify';
import { withTracker } from 'meteor/react-meteor-data';
import { Locations } from '../api/lines.js';
import moment from 'moment';
import Slider from "@material-ui/core/Slider";
import {getDisplayedLineLength, MAX_LINE_LENGTH} from "./Util";
import i18n from 'meteor/universe:i18n'; // <--- 1

const T = i18n.createComponent(i18n.createTranslator('editLine'));

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

    function Line(people) {
        if(people) {
            if(people === 1) {
                return <T _namespace='nearme'>onePerson</T>
            } else {
                return (<div>{getDisplayedLineLength(people)} <T _namespace='nearme'>PeopleInLine</T> </div>)
            }
        } else {
            return <T _namespace='nearme'>noLine</T>
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
                          {/* There {location.line === 1 ? "was" : "were"} {getDisplayedLineLength(location.line)} {location.line === 1 ? "person" : "people"} in line {moment(location.lastUpdate).fromNow()}. */}
                          {Line(location.line)} {"_"}{moment(location.lastUpdate).fromNow()}
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
                        <T>submitInfo1</T> {getDisplayedLineLength(lineSize)} <T>submitInfo2</T>
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
                    <i className="fa fa-warning"/> 
                    <T>warningLocation</T>
                </Card>
                <Card class="isa_info">
                    <i className="fas fa-info-circle"/> 
                    <T>suggest</T>
                </Card>
                <Card class="isa_info" onClick={()=>{console.log(123)}}>
                    <i className="fas fa-info-circle"/>
                    <T>warningInfo</T>
                </Card>
                {renderCard(details)}
            </div>
            <Button modifier="large--cta" style={{ position: "fixed", bottom: 0, zIndex: 1000, minHeight: 50 }}
                // type="submit"
                onClick={() => {
                    submit()
                }}>
                <T>submit</T>
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
