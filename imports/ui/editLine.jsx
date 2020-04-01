import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Input, Select, ListItem, ListTitle, Button, Icon, ProgressCircular } from 'react-onsenui'
import { toast } from 'react-toastify';
import { withTracker } from 'meteor/react-meteor-data';
import { locations } from '../api/lines.js';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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


    function submit() {

        if (status == "0") {
            toast("How busy is it right now?");
            return
        }

        setLoading(true)
        navigator.geolocation.getCurrentPosition((position) => {
            Meteor.call('locations.update', details._id , status, position.coords.longitude, position.coords.latitude, function (err, result) {
                if (err) {
                    setLoading(false)
                    if(err.error == "too far")
                        {
                            toast("You are too far away from the shop!")
                        }
                    else{
                        toast("Are you really at this shop?")
                    }
                    console.log(err)
                    return
                }
                // setLoading(false)
                toast("Thank You!")
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
            </MainLayout>
        )
    }
    return (
        <MainLayout>
            <div style={{ marginBottom: 55 }}>
            <ListTitle>
                Status
            </ListTitle>
            <FormControl component="fieldset" style={{ width: "80%", margin: 20 }}>
                <RadioGroup aria-label="gender" name="gender1" value={status} onChange={(event) => setStatus(event.target.value)}>
                    {/* <FormControlLabel value="0" control={<Radio />} label="How busy is it?" /> */}
                    <FormControlLabel value="no" control={<Radio />} label="There's no line right now" />
                    <FormControlLabel value="small" control={<Radio />} label="Less than 5 people waiting" />
                    <FormControlLabel value="long" control={<Radio />} label="More than 5 people waiting" />
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


export default withTracker(() => {
    Meteor.subscribe('locations');
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')
    return {
        details: locations.findOne({_id: id}),
    };
})(EditLine);
