import React, { useEffect, useState } from 'react'
import MainLayout from './MainLayout'
import { withTracker } from 'meteor/react-meteor-data';
import { Locations, LocationsIndex } from '../api/lines.js';
import { Meteor } from 'meteor/meteor';
import { Icon, Button, ListItem, ListTitle, Card, ActionSheet, ActionSheetButton , SearchInput, ProgressBar } from 'react-onsenui'
import moment from 'moment';
import { Tracker } from 'meteor/tracker'
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import Slider from "@material-ui/core/Slider";
import { getDisplayedLineLength, MAX_LINE_LENGTH } from "./Util";
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterIcon,
    TwitterShareButton
} from "react-share";

function Index({ history }) {
    {/*Initialise props*/ }
    const [clientLocation, setclientLocation] = useCookies(['location']);
    const [nearestShops, setnearestShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Getting your location...");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loadingCardList, setLoadingCardList] = useState({ [""]: false });
    const [isOpen, setIsOpen] = useState(false);
    const [reportId, setReportId] = useState("");

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

    function distance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit == "K") { dist = dist * 1.609344 }
            if (unit == "N") { dist = dist * 0.8684 }
            return dist;
        }
    }

    function checkClientLocation() {
        if (clientLocation.location != undefined) {
            if ((new Date().getTime() - new Date(clientLocation.location.time).getTime()) / 1000 < 300) {
                if (nearestShops.length == undefined || nearestShops.length <= 1) {
                    fetchNearestShops()
                } else {
                    // console.log(nearestShops)
                }
            } else { getClientLocation() }
        } else { getClientLocation() }
    }

    function getClientLocation() {
        setLoading(true)
        var options = {
            enableHighAccuracy: true,
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
        if (clientLocation.location == undefined) {
            lat = latitude;
            long = longitude;
        } else {
            lat = clientLocation.location.latitude;
            long = clientLocation.location.longitude;
        }
        Meteor.call('locations.findnearby', { lat, long }, (err, result) => {
            if (result) {
                setLoading(false)
                setnearestShops(result)
            } else {
                console.log(err)
            }
        }
        );
        setLoadingMessage("Loading nearby stores...")
    }

    function renderList() {
        if (loading) {
            return (<Card>
                <ProgressBar indeterminate />
                {loadingMessage}
            </Card>)
        }
        if (search == "") {
            return nearestShops.map((location) => {
                return renderCard(location)
            }
            )
        }
        else {
            return searchResult.map((location) => {
                return renderCard(location)
            })
        }
    }

    function Line(people) {
        if(people) {
            if(people === 1) {
                return "There was 1 person in line"
            } else {
                return `There were ${getDisplayedLineLength(people)} people in line`
            }
        } else {
            return "There was no line"
        }
    }

    function renderCard(location) {
        var Indicator = "green"
        switch (true) {
            case (location.line == undefined):
                Indicator = "green"
                break
            case (location.line <= 20 && location.line >= 0):
                Indicator = "green"
                break
            case (location.line <= 35 && location.line > 20):
                Indicator = "orange"
                break
            case (location.line > 35):
                Indicator = "red"
                break
        }
        var updateNumber = location.line;
        return (
            <Card key={location._id} style={{ backgroundColor: "white" }}>
                <ListItem style={{ fontSize: 20, fontWeight: "bold" }} modifier="nodivider">
                    {location.name}
                    <div className="right">
                        <Button onClick={() => {
                            // history.push('/duplicated?id=' + location._id)
                            setIsOpen(true)
                            setReportId(location._id)
                        }}>
                            <i className="fas fa-exclamation-triangle" />
                        </Button>
                    </div>
                </ListItem>
                <ListItem modifier="nodivider" expandable>
                    <div className="left">
                        <Icon style={{ paddingRight: 20 }} icon="map-marker-alt" /> {location.address}
                    </div>
                    <div className="expandable-content">
                        <img style={{ maxHeight: 200 }} src={"https://howlongistheline.org/maps/" + location.coordinates[1] + "," + location.coordinates[0] + ",K3340"} />
                    </div>

                </ListItem>
                <ListItem modifier="nodivider">
                    <div className="center" style={{ color: Indicator }}>
                        {Line(location.line)} {moment(location.lastUpdate).fromNow()}.
                    </div>
                    <div className="right">
                        <Button onClick={() => { history.push('/stocks?id=' + location._id) }}>
                            Stock Status
                       </Button>
                    </div>
                </ListItem>
                <ListItem modifier="nodivider">
                    <div className="center">
                        If you are at this store right now, drag the slider to update the line numbers, or confirm the existing numbers.
                  </div>
                </ListItem>
                <ListItem modifier="nodivider">
                    <div className="center">
                        <Slider
                            defaultValue={parseInt(location.line) ? parseInt(location.line) : 0}
                            min={0}
                            max={MAX_LINE_LENGTH}
                            style={{ width: "80%", margin: "0px 15px" }}
                            valueLabelDisplay="auto"
                            valueLabelFormat={getDisplayedLineLength}
                            onChangeCommitted={function (event, value) {
                                if (event.type === "mouseup" || event.type === "touchend") {
                                    window.document.activeElement.value = value;
                                    let buttonText = '';
                                    if (location.line === value || (value === 0 && !location.line)) {
                                        buttonText = `Confirm ${getDisplayedLineLength(location.line)} ${location.line === 1 ? "person is" : "people are"} waiting in line`;
                                    } else {
                                        buttonText = `Update line length to ${getDisplayedLineLength(value)} ${value === 1 ? "person" : "people"}`;
                                    }
                                    document.getElementById(location._id).innerHTML = buttonText;
                                    updateNumber = value;
                                }
                            }}
                        />
                    </div>
                    <div className="right">
                    </div>
                </ListItem>
                <ListItem modifier="nodivider" style={{ flexWrap: 'wrap' }}>
                    <div className="center">
                        <Button id={location._id} onClick={
                            function (event) {
                                setLoadingCardList({
                                    ...loadingCardList,  //take existing key-value pairs and use them in our new state,
                                    [location._id]: true   //define new key-value pair with new uuid and [].
                                })
                                var loc = Locations.findOne({
                                    _id: location._id
                                })
                                var options = {
                                    enableHighAccuracy: true,
                                    timeout: 10000,
                                    maximumAge: 300000
                                };
                                navigator.geolocation.getCurrentPosition((position) => {
                                    //client side distance check
                                    var distanceInMeter = distance(position.coords.latitude, position.coords.longitude, loc.coordinates[1], loc.coordinates[0], "K") * 1000
                                    if (distanceInMeter > 100) {
                                        history.push("/editLine?id=" + location._id + "&lineSize=" + updateNumber, { location: location })
                                        return
                                    }
                                    Meteor.call('locations.updatelinesize', location._id, updateNumber, function (err, result) {
                                        if (err) {
                                            toast("Some error happened, Please try again later!")
                                            console.log(err)
                                            setLoadingCardList({
                                                ...loadingCardList,  //take existing key-value pairs and use them in our new state,
                                                [location._id]: false   //define new key-value pair with new uuid and [].
                                            })
                                            // history.push("/editLine?id=" + location._id + "&lineSize=" + updateNumber, { location: location })
                                            return
                                        }
                                        // setLoading(false)
                                        alert("The store has been updated, thank you!")
                                        history.go(0)
                                    });
                                }, (err) => {
                                    console.log(err)
                                    toast("Some error happened, Please try again later!")
                                    setLoadingCardList({
                                        ...loadingCardList,  //take existing key-value pairs and use them in our new state,
                                        [location._id]: false   //define new key-value pair with new uuid and [].
                                    })
                                }, options)
                            }
                        }>
                            Confirm {getDisplayedLineLength(location.line)} {location.line === 1 ? "person is" : "people are"} waiting in line
                </Button>
                    </div>
                    <div className="right">
                        <FacebookShareButton
                            url={"https://howlongistheline.org"}
                            quote={"There " + (location.line === 1 ? "was " : "were ") + getDisplayedLineLength(location.line) + " people waiting in line at " + location.name.trim() + " (" + location.address.trim() + ") " + moment(location.lastUpdate).fromNow()}
                            hashtag="#howlongistheline"
                        >
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        <TwitterShareButton
                            url={"https://howlongistheline.org"}
                            title={"There " + (location.line === 1 ? "was " : "were ") + getDisplayedLineLength(location.line) + " people waiting in line at " + location.name.trim() + " (" + location.address.trim() + ") " + moment(location.lastUpdate).fromNow()}
                        >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>

                    </div>
                </ListItem>
                {loadingCardList[location._id] ? <> <ProgressBar indeterminate /> Updating</> : <></>}
            </Card>
        )
    }

    return (
        <MainLayout>
            <div className="search-container" style={{ position: "sticky", top: 0, zIndex: 1000, background: "#fff" }}>
                <ListItem>
                    <SearchInput style={{ width: "100%", backgroundColor: "#d9f4ff", color: "black" }} placeholder="Find stores near you." onChange={(e) => {
                        setSearch(e.target.value)
                    }} />
                </ListItem>
            </div>
            <div className="border-top" style={{ marginBottom: 55 }}>
            <Card class="isa_custom">
                <i className="fas fa-info-circle" /> We're looking for something new to work on after the lockdown. <a href="https://docs.google.com/forms/d/e/1FAIpQLSc1uRMABgs-tf-ZhkS28uiVvjRZfMTCTUaPsb9wvQcsbb804Q/viewform?usp=sf_link">Is your business facing a problem that technology could help with?</a>
            </Card>
                <Card class="isa_info">
                    <i className="fas fa-info-circle" /> If something doesn't work properly, check back a few days later and it will probably be fixed.
                  Go <a href="https://github.com/howlongistheline/howlongistheline.org/issues">here</a> to see what the community behind this is currently working on.
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
            <ActionSheet isCancelable isOpen={isOpen}
            onCancel={()=>{setIsOpen(false)}}
            >
             <ActionSheetButton onClick={()=>{history.push('/duplicated?id=' + reportId)}}> Report Duplicated</ActionSheetButton>
             <ActionSheetButton onClick={()=>{history.push('/editLocation?id=' + reportId)}}> Report Wrong Location</ActionSheetButton>
             <ActionSheetButton onClick={()=>{setIsOpen(false)}}>Cancel</ActionSheetButton>
            </ActionSheet>
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
