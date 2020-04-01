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
    const [status, setStatus] = useState("0"); //0:not selected
    const [address, setAddress] = useState("");
    const [confirm, setCofirm] = useState(false);

    function submit() {

        if (name == "") {
            toast("Please enter the shop name");
            return
        }
        if (status == "0") {
            toast("How busy is it right now?");
            return
        }
        if (address == "") {
            toast("Please enter address or branch name");
            return
        }
        if (confirm == false) {
            toast("You must be at the shop's location in order to add it or update the status.");
            return
        }
        if (!navigator.geolocation) {
            toast("Cant get current location")
            console.log("Cant get current location")
        }
        setLoading(true)
        navigator.geolocation.getCurrentPosition((position) => {
            Meteor.call('locations.insert', name, [position.coords.longitude, position.coords.latitude], address, status, function (err, result) {
                if (err) {
                    setLoading(false)
                    console.log(err)
                    return
                }
                // setLoading(false)
                toast("Success!")
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
                Finding your current GPS location, please wait...
            </MainLayout>
        )
    }
    return (
        <MainLayout>
             <div style={{ marginBottom: 55 }}>
            <ListTitle>
            Shop Details
            </ListTitle>
            <ListItem modifier="nodivider">
                <Input
                    style={{ width: "100%" }}
                    value={name}
                    onChange={(event) => { setName(event.target.value) }}
                    modifier='material'
                    placeholder='Name of shop; e.g. Countdown' />
            </ListItem>

            <ListTitle>
            </ListTitle>
            <ListItem modifier="nodivider">
            <textarea style={{width: "80%", margin:20}}className="textarea" rows="3" placeholder="Branch name OR full address; e.g. South Dunedun or 323 Andersons Bay Road, South Dunedin, Dunedin 9012" value={address} onChange={(e)=>{setAddress(e.target.value)}}>
            </textarea>
            </ListItem>
            <ListItem modifier="nodivider" tappable onClick={()=>{setCofirm(!confirm)}}>
            <Checkbox
                style={{paddingRight: 10}}
                checked={confirm}
                modifier='material' />
            I am at this location right now
            </ListItem>
            <FormControl component="fieldset" style={{ width: "80%", margin: 20 }}>
                <RadioGroup aria-label="gender" name="gender1" value={status} onChange={(event) => setStatus(event.target.value)}>
                    {/* <FormControlLabel value="0" control={<Radio />} label="How busy is it?" /> */}
                    <FormControlLabel value="no" control={<Radio />} label="There's no line right now" />
                    <FormControlLabel value="small" control={<Radio />} label="6 or less people waiting" />
                    <FormControlLabel value="long" control={<Radio />} label="More than 6 people waiting" />
                </RadioGroup>
            </FormControl>
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
