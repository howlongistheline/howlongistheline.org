import React, {useState, useEffect} from 'react'
import MainLayout from './MainLayout'
import { Input, Select , ListItem, ListTitle, Button, Icon, ProgressCircular } from 'react-onsenui'
import { toast } from 'react-toastify';

export default function AddLine({history}) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("0"); //0:not selected

    function submit(){
        setLoading(true)

        if (name == "") {
            toast("Please enter name");
            return
        }
        if (status== "0") {
            toast("Please select status");
            return
        }
        if (!navigator.geolocation) {
            toast("Cant get current location")
        }
        navigator.geolocation.getCurrentPosition((position) => {
            Meteor.call('lines.insert', name, position.coords , status , function (err, result) {
                if (err) {
                    setLoading(false)
                    console.log(err)
                    return
                }
                // setLoading(false)
                toast("成功！ Success!")
                history.push('/')
            });
        })
    }
    if(loading){
        return(
            <MainLayout>
                <ProgressCircular indeterminate style={{width: 50}}/>
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
            style={{width:"100%"}}
            value={name}
            onChange={(event) => { setName( event.target.value)} }
            modifier='material'
            placeholder='Location Name' />
            </ListItem>
            <ListTitle>
                Status
            </ListTitle>
            <Select modifier="material"
            style={{width: "80%", margin: 20}}
            value={status}
            onChange={(event) => setStatus(event.target.value)}>
            <option value="0">Please select status</option>
            <option value="no">No line</option>
            <option value="small">Small line</option>
            <option value="long">Long line</option>
            </Select>
            <Button modifier="large--cta" style={{ position: "fixed", bottom: 0, zIndex: 1000, minHeight: 50 }}
                    // type="submit" 
                    onClick={() => {
                        submit()
                    }}>
                    Submit
                    <Icon style={{marginLeft: 10}} icon='fa-plus' />
                </Button>
        </MainLayout>
    )
}


