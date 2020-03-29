import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Input, Select, ListItem, ListTitle, Button, Icon, ProgressCircular, Checkbox } from 'react-onsenui'
import { toast } from 'react-toastify';

export default function AddLine({ history }) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("0"); //0:not selected
    const [address, setAddress] = useState("");
    const [confirm, setCofirm] = useState(false);

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
        if (confirm == false) {
            toast("Please confirm that you are at the shop");
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
            toast("Cant get current location, please turn on browser's geolocation function")
            setLoading(false)
            console.warn(`ERROR(${err.code}): ${err.message}`);
          }
    }
    if (loading) {
        return (
            <MainLayout>
                <ProgressCircular indeterminate />
                Loading...
            </MainLayout>
        )
    }
    return (
        <MainLayout>
             <div style={{ marginBottom: 55 }}>
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
            <ListItem>
            <textarea style={{width: "80%", margin:20}}className="textarea" rows="3" placeholder="Full Address" value={address} onChange={(e)=>{setAddress(e.target.value)}}>
            </textarea>
            </ListItem>
            <ListItem tappable onClick={()=>{setCofirm(!confirm)}}>
            <Checkbox
                style={{paddingRight: 10}}
                checked={confirm}
                modifier='material' />
            I confirm that I am at the shop.
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


