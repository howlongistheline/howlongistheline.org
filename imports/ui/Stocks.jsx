import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Input, Select, ListItem, ListTitle, Button, Icon, ProgressCircular, Checkbox, Card } from 'react-onsenui'
import { toast } from 'react-toastify';
import { Locations, Additionals, LocationsIndex } from '../api/lines.js';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';

function Stocks({ details, additional, history }) {
    if (!details || !additional) {
        return <MainLayout>
            <ProgressCircular indeterminate />
        </MainLayout>

    }

    const [itemName, setItemName] = useState("")

    function renderStocks() {
        if (additional.outofStock == undefined) {
            return (
                <ListItem>
                    No data for this store right now.
                </ListItem>
            )
        }
        const stocks = additional.outofStock.sort((a, b) => a.time - b.time)
        return stocks.reverse().map((stock, idx) => {
            return (
                <ListItem key={idx} modifier="longdivider" style={{ flexWrap: "wrap", justifyContent: "space-between" }}> 
                    <div className="left">{stock.name}</div>
                    <div className="center" style= {{flexFlow: "row-reverse", paddingLeft: 6, paddingRight: 10}}>
                        { stock.refilled ? moment(stock.refillTime).fromNow() : moment(stock.time).fromNow()}
                    </div>
                    <div className="right">
                    { stock.refilled ? <div style={{color: "green"}}> Now back in stock &nbsp; </div> :
                        <Button onClick={() => {
                            Meteor.call('Outofstock.refilled', details._id, stock, (err, result) => {
                                if (err) {
                                    console.log(err)
                                    return
                                }
                            })
                        }}>
                            Back in stock</Button>}
                    </div>
                </ListItem>
            )
        })
    }

    function addStock() {
        sanitisedName = itemName.replace(/[^0-9a-zA-Z ]/g, ''); // Remove non-alphanumerics
        if (sanitisedName.match(/Test/i)){                      // Ensure any string containing 'test' is not accepted
            sanitisedName = "";
        }
        if (sanitisedName == "" || sanitisedName.length < 3) {
            toast("Please enter a meaningful description.");
            console.log(err)
            return
        }
        Meteor.call("Outofstock.insert", details._id, sanitisedName, (err, result) => {
            if (err) {
                toast("An error occurred while adding your item.")
                return
            }
            toast("Success! Thank you.")
            setItemName("")
        })

    }

    return (
        <MainLayout>
            <div style={{ marginBottom: 55 }}>
                <Card>
                    <ListTitle>
                        Store Details
                    </ListTitle>
                    <ListItem modifier="nodivider">
                        {details.name}
                    </ListItem>
                    <ListItem modifier="nodivider">
                        {details.address}
                    </ListItem>
                </Card>
                <Card>
                    <ListTitle>
                        Stock Status:
                    </ListTitle>
                    <ListItem modifier="nodivider">
                        <Input
                            style={{ width: "80%" }}
                            value={itemName} float
                            onChange={(event) => { setItemName(event.target.value) }}
                            modifier='material'
                            placeholder='Is anything out of stock?' />
                        <div className="right">
                            <Button onClick={() => { addStock() }}>
                                Add Item
                            </Button>
                        </div>
                    </ListItem>
                </Card>
                <Card>
                    <ListTitle>
                        Out of Stock Items
                    </ListTitle>
                    {renderStocks()}
                </Card>
            </div>
        </MainLayout>
    )
}

export default withTracker(() => {
    Meteor.subscribe('locations');
    Meteor.subscribe('additionals')
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')
    return {
        details: Locations.findOne({ _id: id }),
        additional: Additionals.findOne({ locationId: id }),
    };
})(Stocks);
