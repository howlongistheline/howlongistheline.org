import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Input, Select, ListItem, ListTitle, Button, Icon, ProgressCircular } from 'react-onsenui'
import { toast } from 'react-toastify';
import { withTracker } from 'meteor/react-meteor-data';
import { locations } from '../api/lines.js';

function EditLine({ history, details }) {
    if (!details) {
        return (
            <MainLayout>
                <ProgressCircular indeterminate />
            </MainLayout>
        )
    }
    const [name, setName] = useState(details.name);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(details.status); //0:not selected
    const [address, setAddress] = useState(details.address);


    function submit() {

        if (name == "") {
            toast("Please enter name");
            return
        }
        if (status == "0") {
            toast("Please select status");
            return
        }
        if (address == "") {
            toast("Please enter address");
            return
        }

        setLoading(true)
        Meteor.call('locations.update', details._id ,name, address, status, function (err, result) {
            if (err) {
                setLoading(false)
                console.log(err)
                return
            }
            // setLoading(false)
            toast("Success!")
            history.push('/')
        });
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
            <ListTitle>
                Location Name
            </ListTitle>
            <ListItem>
                <Input
                    style={{ width: "100%" }}
                    value={name}
                    onChange={(event) => { setName(event.target.value) }}
                    modifier='material'
                    placeholder='Location Name' />
            </ListItem>
            <ListTitle>
                Status
            </ListTitle>
            <Select modifier="material"
                style={{ width: "80%", margin: 20 }}
                value={status}
                onChange={(event) => setStatus(event.target.value)}>
                <option value="0">Please select status</option>
                <option value="no">No line</option>
                <option value="small">Small line</option>
                <option value="long">Long line</option>
            </Select>
            <ListTitle>
                Address
            </ListTitle>
            <textarea style={{width: "80%", margin:20}}className="textarea" rows="3" placeholder="Full Address" 
            value={address} onChange={(e)=>{setAddress(e.target.value)}}>
            </textarea>
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
        details: locations.findOne({_id: id}),
    };
})(EditLine);