import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Input, Select, ListItem, ListTitle, Button, Icon, ProgressCircular, Checkbox } from 'react-onsenui'
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
                    No data for this shop right now
                </ListItem>
            )
        }
        const stocks = additional.outofStock.sort((a, b) => a.time - b.time)
        return stocks.reverse().map((stock, idx) => {
            return (
                <ListItem key={idx}>
                    <div className="left">{stock.name} { stock.refilled ? "is back in stock":"is out of stock" }</div>
                    <div className="center">{ stock.refilled ? moment(stock.refillTime).fromNow() : moment(stock.time).fromNow()}</div>
                    <div className="right">
                    { stock.refilled ? <div style={{color: "green"}}> Back in stock! </div> :
                        <Button onClick={() => {
                            Meteor.call('Outofstock.refilled', details._id, stock, (err, result) => {
                                if (err) {
                                    console.log(err)
                                    return
                                }
                            })
                        }}>It is back in stock!</Button>}
                    </div>
                </ListItem>
            )
        })
    }

    function addStock() {
        sanitisedName = itemName.replace(/[^0-9a-zA-Z ]/g, ''); // Remove non-alphanumerics
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
                <ListTitle>
                    Store Details
            </ListTitle>
                <ListItem modifier="nodivider">
                    {details.name}
                </ListItem>
                <ListTitle>
                </ListTitle>
                <ListItem modifier="nodivider">
                    {details.address}
                </ListItem>
                <ListTitle style={{ marginTop: 30 }}>
                    Stock Status:
                </ListTitle>
                <ListItem>
                    <Input
                        style={{ width: "80%" }}
                        value={itemName} float
                        onChange={(event) => { setItemName(event.target.value) }}
                        modifier='material'
                        placeholder='Is anything out of stock?' />
                    <div className="right">
                        <Button onClick={() => { addStock() }}>
                            <Icon icon="fa-send"></Icon>
                        </Button>
                    </div>
                </ListItem>
                {renderStocks()}
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
