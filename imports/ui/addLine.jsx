import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Input, Select, ListItem, ListTitle, Button, Icon, ProgressCircular, Checkbox } from 'react-onsenui'
import { toast } from 'react-toastify';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function AddLine({ history }) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("no"); //0:not selected
    const [address, setAddress] = useState("");
    const [confirm, setCofirm] = useState(false);
    const [listed, setListed] = useState(false);

    function submit() {

        if (name == "") {
            toast("Please enter the store name and branch");
            return
        }
        if (status == "0") {
            toast("How busy is it right now?");
            return
        }
        if (address == "") {
            toast("Please enter the full address of the store");
            return
        }
        if (confirm == false) {
            toast("You must be at the store's location in order to add it or update the status.");
            return
        }
        if (listed == false) {
            toast("Please make sure the store is not already listed first.");
            return
        }
        if (!navigator.geolocation) {
            toast("Can't get current location")
            console.log("Can't get current location")
        }
        setLoading(true)
        var options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        };
        navigator.geolocation.getCurrentPosition((position) => {
            Meteor.call('locations.insert', name, [position.coords.longitude, position.coords.latitude], address, "no", function (err, result) {
                if (err) {
                    setLoading(false)
                    console.log(err)
                    return
                }
                // setLoading(false)
                toast("Success!")
                history.push('/')
            });
        }, error, options)

        function error(err) {
            toast("Can't get current location, please turn on your browser's geolocation function or try a different browser.")
            setLoading(false)
            console.warn(`ERROR(${err.code}): ${err.message}`);
          }
    }
    if (loading) {
        return (
            <MainLayout>
                <ProgressCircular indeterminate />
                Finding your current GPS location, please wait...
            </MainLayout>
        )
    }
    return (
        <MainLayout>
             <div style={{ marginBottom: 55 }}>
            <ListItem>
                <div className="left"> Store Details</div>
                <div className="right">
                <Button onClick={()=>{history.push('/')}}>
                    Cancel
                </Button>
                </div>
            </ListItem>
            <ListItem modifier="nodivider" tappable onClick={()=>{setListed(!listed)}}>
            <Checkbox
                style={{paddingRight: 10}}
                checked={listed}
                modifier='material' />
            Please use the search bar at the top of the home page to verify that the store you are adding is not already listed and then come back and tick this box, thank you!
            </ListItem>
            <ListItem modifier="nodivider">
                <Input
                    style={{ width: "100%" }}
                    value={name}
                    onChange={(event) => { setName(event.target.value) }}
                    modifier='material'
                    placeholder='Name of store, e.g. Countdown South Dunedin' />
            </ListItem>

            <ListTitle>
            </ListTitle>
            <ListItem modifier="nodivider">
            <textarea style={{width: "80%", margin:20}}className="textarea" rows="3" placeholder="Full address of the store; 323 Andersons Bay Road, South Dunedin, Dunedin 9012" value={address} onChange={(e)=>{setAddress(e.target.value)}}>
            </textarea>
            </ListItem>
            <ListItem modifier="nodivider" tappable onClick={()=>{setCofirm(!confirm)}}>
            <Checkbox
                style={{paddingRight: 10}}
                checked={confirm}
                modifier='material' />
            Are you at this location right now? If not, please wait until you next go to this store and add it at that time, rather than adding it now. You may also consider posting this to your social media and asking other people to add stores in your area when they are physically at the location :) For more information on why this is important please see the FAQ page.
            </ListItem>
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
