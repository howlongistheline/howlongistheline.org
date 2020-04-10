import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Input, SearchInput, ListItem, ListTitle, Button, Icon, ProgressCircular, Checkbox, Card } from 'react-onsenui'
import { toast } from 'react-toastify';
import { Locations, LocationsIndex } from '../api/lines.js';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';

function Duplicated({ history, ready, original }) {

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("0"); //0:not selected
    const [address, setAddress] = useState("");
    const [coord, setCoord] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [selected, setSelected] = useState([]);
    const [step, setStep] = useState(0)

    useEffect(() => {
        if (original != undefined) {
            setSelected([original])
            setName(original.name)
            setAddress(original.address)
        }
    }, [ready])

    useEffect(() => {
        let cursor = LocationsIndex.search(search)
        setSearchResult(cursor.fetch())
    }, [search])

    if (loading || !ready) {
        return (
            <MainLayout>
                <ProgressCircular indeterminate />
            </MainLayout>
        )
    }

    function renderSelected() {
        if (selected == []) {
            return
        }
        else {
            return selected.map((location) => {
                return renderSelectedCard(location)
            })
        }
    }

    function renderSelectedCard(location) {
        return (<ListItem tappable key={"m" + location._id} onClick={() => {
            const index = selected.indexOf(location);
            if (index > -1) {
                var test = selected.filter(item => item !== location)
                setSelected(test)
            }
        }}>
            <div className="left">
                <Icon icon="fa-minus" />
            </div>
            <div className="center">
                {"name: " + location.name} {" address: " + location.address}
            </div>
        </ListItem>
        )
    }

    function renderList() {
        if (search == "") {
            return
        }
        else {
            return searchResult.map((location) => {
                return renderSearchCard(location)
            })
        }
    }

    function renderSearchCard(location) {
        return (<ListItem tappable key={"s" + location._id} onClick={() => {
            if (selected.includes(location)) {
                return
            }
            var nA = selected.concat([location])
            setSelected(nA)
        }}>
            <div className="left">
                <Icon icon="fa-plus" />
            </div>
            <div className="center">
                {"name: " + location.name} {" address: " + location.address}
            </div>
        </ListItem>)
    }

    function submit() {

        if (selected.length <= 1) {
            toast("Please select more than 1 shops");
            return
        }
        setStep(1)
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
        return (
            <Card key={location._id} style={{ backgroundColor: "white" }}>
                <ListItem modifier="nodivider">
                    {location.name}
                </ListItem>
                <ListItem modifier="nodivider">
                    {location.address}
                </ListItem>
                <ListItem modifier="nodivider">
                    <div className="center" style={{ color: Indicator }}>There were {location.line ? location.line : 0} people in line {moment(location.lastUpdate).fromNow()}. </div>
                </ListItem>
            </Card>
        )
    }

    function renderConfirmList() {
        return selected.map((location) => {
            return renderCard(location)
        })
    }


    function renderNameList() {
        return selected.map((location) => {
            return <ListItem key={location._id} tappable onClick={() => {
                setName(location.name)
                setStep(3)
            }}>
                <div className="left">
                    {location.name}
                </div>
                <div className="right">
                    <Icon icon="fa-chevron-right" />
                </div>
            </ListItem>
        })
    }

    function renderAddressList() {
        return selected.map((location) => {
            return <ListItem key={location._id} tappable onClick={() => {
                setAddress(location.address)
                setStep(4)
            }}>
                <div className="left">
                    {location.address}
                </div>
                <div className="right">
                    <Icon icon="fa-chevron-right" />
                </div>
            </ListItem>
        })
    }

    function renderCoordList() {
        return selected.map((location) => {
            return <ListItem key={location._id} tappable onClick={() => {
                setCoord(location.coordinates)
                setStep(5)
            }}>
                <div className="left">
                    {/* {location.coordinates} */}
                    <img src={"https://howlongistheline.org/maps/" + location.coordinates[1] + "," + location.coordinates[0] + ",K3340"} />
                </div>
                <div className="right">
                    <Icon icon="fa-chevron-right" />
                </div>
            </ListItem>
        })
    }

    switch (step) {
        case 0:
            return (
                <MainLayout>
                    <div style={{ marginBottom: 55 }}>
                        <ListItem>
                            <div className="left"> Report Duplicated Shops</div>
                            <div className="right">
                                <Button onClick={() => { history.push('/') }}>
                                    Cancel
                </Button>
                            </div>
                        </ListItem>
                        <ListItem modifier="nodivider">
                            <SearchInput style={{ width: "80%", backgroundColor: "#d9f4ff", color: "black" }} placeholder="Type the name of a store or locality to find duplicated shops" onChange={(e) => {
                                setSearch(e.target.value)
                            }} />
                        </ListItem>
                        {renderList()}
                        <ListTitle style={{ marginTop: 50 }}>
                            Duplicated Shops
                </ListTitle>
                        {renderSelected()}
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
        case 1:
            return (
                <MainLayout>
                    <div style={{ marginBottom: 55 }}>
                        <ListItem>
                            <div className="left"> Please verify that these are really all duplicates of the same store. </div>
                            <div className="right">
                                <Button onClick={() => { history.push('/') }}>
                                    Cancel
                                </Button>
                            </div>
                        </ListItem>
                        {renderConfirmList()}
                    </div>
                    <Button modifier="large--cta" style={{ position: "fixed", bottom: 0, zIndex: 1000, minHeight: 50 }}
                        // type="submit"
                        onClick={() => {
                            setStep(2)
                        }}>
                        Confirm
                    <Icon style={{ marginLeft: 10 }} icon='fa-plus' />
                    </Button>
                </MainLayout>
            )
        case 2:
            return (
                <MainLayout>
                    <ListItem>
                        <div className="left"> Please select the best shop name from the list.</div>
                        <div className="right">
                            <Button onClick={() => { history.push('/') }}>
                                Cancel
                            </Button>
                        </div>
                    </ListItem>
                    {renderNameList()}
                </MainLayout>
            )
        case 3:
            return (
                <MainLayout>
                    <ListItem>
                        <div className="left"> Please select the best address from the list.</div>
                        <div className="right">
                            <Button onClick={() => { history.push('/') }}>
                                Cancel
                            </Button>
                        </div>
                    </ListItem>
                    {renderAddressList()}
                </MainLayout>
            )
        case 4:
            return (
                <MainLayout>
                    <ListItem>
                        <div className="left"> Please select the best location from the list.</div>
                        <div className="right">
                            <Button onClick={() => { history.push('/') }}>
                                Cancel
                            </Button>
                        </div>
                    </ListItem>
                    {renderCoordList()}
                </MainLayout>
            )
        case 5:
            return (
                <MainLayout>
                    <div style={{ marginBottom: 55 }}>
                        <ListItem>
                            <div className="left"> Please confirm that all the information is correct. </div>
                            <div className="right">
                                <Button onClick={() => { history.push('/') }}>
                                    Cancel
                            </Button>
                            </div>
                        </ListItem>
                        <Card style={{ backgroundColor: "white" }}>
                            <ListItem modifier="nodivider">
                                {name}
                            </ListItem>
                            <ListItem modifier="nodivider">
                                {address}
                            </ListItem>
                            <ListItem modifier="nodivider">
                                {/* {coord} */}

                                <img src={"https://howlongistheline.org/maps/" + coord[1] + "," + coord[0] + ",K3340"} />

                            </ListItem>
                        </Card>
                    </div>
                    <Button modifier="large--cta" style={{ position: "fixed", bottom: 0, zIndex: 1000, minHeight: 50 }}
                        // type="submit"
                        onClick={() => {
                            var ids = selected.map(a => a._id);
                            var mostRecentDate = new Date(Math.max.apply(null, selected.map( e => {
                                return new Date(e.lastUpdate);
                             })));
                            var mostRecentObject = selected.filter( e => {
                                var d = new Date( e.lastUpdate );
                                return d.getTime() == mostRecentDate.getTime();
                            })[0];
                            Meteor.call('Locations.merge', ids, name, coord, address, mostRecentObject.line, mostRecentObject.lastUpdate, (err, result)=>{
                                if(err){
                                    toast("some Error happens")
                                    return
                                }
                                toast("Thank you for you input! The duplicated shops are removed now!")
                                history.push('/')
                                return
                            })
                        }}>
                        Confirm
                <Icon style={{ marginLeft: 10 }} icon='fa-plus' />
                    </Button>
                </MainLayout>
            )
    }
}


export default withTracker(() => {
    var sub = Meteor.subscribe('locations');
    const ready = sub.ready();
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')
    return {
        ready,
        original: Locations.findOne({ _id: id })
    };
})(Duplicated);
