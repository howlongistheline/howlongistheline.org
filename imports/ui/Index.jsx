import React, { useEffect, useState } from 'react'
import MainLayout from './MainLayout'
import { withTracker } from 'meteor/react-meteor-data';
import { locations, locationsIndex } from '../api/lines.js';
import { Meteor } from 'meteor/meteor';
import { Icon, Button, ListItem, ListTitle, Card, ProgressCircular, SearchInput } from 'react-onsenui'
import moment from 'moment';
import { Tracker } from 'meteor/tracker'
import { toast } from 'react-toastify';

function Index({ history }) {

    const [nearby, setNearby] = useState();
    const [AllLocations, setAllLocations] = useState([])
    const [search, setSearch] = useState("");
    const [currentLocation, setCurrentLocation] = useState();
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentLocation(position)
            getNearby(position)
        }, (err) => {
            toast("Cant get current location, please turn on browser's geolocation function and refresh, or try a different browser")
            console.warn(`ERROR(${err.code}): ${err.message}`);
        });
        return () => {
        }
    }, [])


    function getNearby(position){
        Meteor.call('locations.findnearby', position.coords.longitude, position.coords.latitude, (err, result) => {
            setNearby(result)
        })
    }


    useEffect(() => {
        let isCancelled = false;
        try {
            if (!isCancelled) {
                Tracker.autorun(function () {
                    if (!isCancelled) {
                        if (search == "") {
                            setAllLocations(locations.find({}, { sort: { lastUpdate: -1 }, limit: 20 }).fetch())
                        }
                        else {
                            let cursor = locationsIndex.search(search)
                            setAllLocations(cursor.fetch())
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

    function renderCard(location) {
        return (
            <Card key={location._id}>
                <ListItem modifier="nodivider">
                    {location.name}
                    <div className="right">
                        Updated: {moment(location.lastUpdate).fromNow()}

                    </div>
                </ListItem>
                <ListItem modifier="nodivider">
                    {location.address}
                    <div className="right">
                    <Button
                        onClick={() => {
                            history.push('/shopDetails?id=' + location._id)
                        }}
                    >More Details</Button>
                    </div>
                </ListItem>
                <ListItem modifier="nodivider">
                    <div className="left">Status:&nbsp;{statusToWord(location.status)}</div>

                    <div className="right">
                    <Button
                        onClick={() => {
                            history.push('/editLine?id=' + location._id)
                        }}
                    >Update line status now</Button>
                    </div>
                    </ListItem>
                    {/*
                    <div className="right">
                        {location.upvote}
                        <Button modifier="quiet"
                            onClick={(e) => {
                                e.preventDefault()
                                Meteor.call("locations.upvote", location._id, (err, result)=>{
                                    if(err){
                                    toast(err)
                                    }
                                    if(result=="wait"){
                                        toast("please wait 1 min to upvote")
                                    }
                                })
                                getNearby(currentLocation)
                            }}>

                            <Icon
                                size={15}
                                icon="fa-thumbs-up"
                            />
                        </Button>
                    </div>
                    */}
            </Card>
        )
    }

    function statusToWord(statusCode) {
        switch (statusCode) {
            case "no":
                return <div style={{ color: "green" }}>No Lines!</div>
            case "small":
                return <div style={{ color: "orange" }}>A Wee Wait</div>
            case "long":
                return <div style={{ color: "red" }}>Busy. Stay Home.</div>
        }
    }

    function renderList() {
        return AllLocations.map((location) => {
            return renderCard(location)
        })
    }

    function renderNearby() {
        if (!nearby) {
            return (
                <Card>
                    <div><ProgressCircular indeterminate />Please wait, finding your current location...</div>
                </Card>
            )
        }
        return nearby.map((location) => {
            return renderCard(location)
        })
    }
    if (search != "") {
        return (
            <MainLayout>
                <div style={{ position: "sticky", top: 0 }}>
                    <ListItem>
                        <SearchInput style={{ width: "80%" }} placeholder="search" onChange={(e) => {
                            setSearch(e.target.value)
                        }} />
                    </ListItem>
                </div>
                <div style={{ marginBottom: 55 }}>
                    <ListTitle>
                        Results
                </ListTitle>
                    {renderList()}
                </div>
                <Button modifier="large--cta" style={{ position: "fixed", bottom: 0, zIndex: 1000, minHeight: 50 }}
                    // type="submit"
                    onClick={() => { history.push('/addLine') }}>
                    Add a new shop
                        <Icon style={{ marginLeft: 10 }} icon='fa-plus' />
                </Button>
            </MainLayout>
        )
    }
    return (
        <MainLayout>
            <div style={{ position: "sticky", top: 0 }}>
                <ListItem>
                    <SearchInput style={{ width: "80%" }} placeholder="search" onChange={(e) => {
                        setSearch(e.target.value)
                    }} />
                </ListItem>
            </div>
            <div style={{ marginBottom: 55 }}>
                <ListTitle>
                    Shops Near You
            </ListTitle>
                {renderNearby()}
                <ListTitle>
                    All Shops
            </ListTitle>
                {renderList()}
            </div>
            <Button modifier="large--cta" style={{ position: "fixed", bottom: 0, zIndex: 1000, minHeight: 50 }}
                // type="submit"
                onClick={() => { history.push('/addLine') }}>
                Add a new shop
                    <Icon style={{ marginLeft: 10 }} icon='fa-plus' />
            </Button>
        </MainLayout>
    )
}


export default withTracker(() => {
    Meteor.subscribe('locations');

    return {
        // AllLocations: locations.find({}, { sort: { lastUpdate: -1 } }).fetch(),
        //   currentUser: Meteor.user,
    };
})(Index);
