import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Input, SearchInput, ListItem, ListTitle, Button, Icon, ProgressCircular, Checkbox, Card } from 'react-onsenui'
import { toast } from 'react-toastify';
import { Locations, LocationsIndex, Additionals } from '../api/lines.js';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';

function EditLocation({ history, ready, original }) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("");
    const [coordHist, setCoordHist] = useState([])
    const [step, setStep] = useState(0)
    const [coord, setCoord] = useState([]);

    useEffect(() => {
        if (original != undefined) {
            setName(original.name)
            setAddress(original.address)
            setLoading(true)
            Meteor.call('Location.findAllCoordHistory', [original._id],(err, result)=>{
                if(err){
                    setLoading(false)
                    return
                }
                setLoading(false)
                setCoordHist(result)
            })
            console.log(coordHist)
        }
    }, [ready])



    if (loading || !ready) {
        return (
            <MainLayout>
                <ProgressCircular indeterminate />
            </MainLayout>
        )
    }

    function renderCoordList() {
        var coords = coordHist.concat([original.coordinates])
        // console.log(coords)
        return coords.map((location, idx) => {
            return <ListItem key={idx} tappable onClick={() => {
                setCoord(location)
                setStep(1)
            }}>
                <div className="left">
                    <img src={"https://howlongistheline.org/maps/" + location[1] + "," + location[0] + ",K3340"} />
                </div>
                <div className="right">
                    <Icon icon="fa-chevron-right" />
                </div>
            </ListItem>
        })
    }

    if(step == 0 ){
    return (
        <MainLayout>
            <ListItem modifier="nodivider">
                <div className="left"> Which map below best shows the location of this store?</div>
                <div className="right">
                    <Button onClick={() => { history.push('/') }}>
                        Cancel
                    </Button>
                </div>
            </ListItem>
            {renderCoordList()}
        </MainLayout>
    )
    }
    else{
    return (
        <MainLayout>
            <div style={{ marginBottom: 55 }}>
                <ListItem modifier="nodivider">
                    <div className="left"> Does everything look ok? Please note that if you are intentionally providing misleading information your IP address, device fingerprint, and physical location will be published.</div>
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
                    setLoading(true)
                    Meteor.call('Location.updateLocation', original._id, coord, (err, result) => {
                        if (err) {
                            console.log(err)
                            toast("Some unknown error has occurred, let us know what you were doing and we can probably fix it.")
                            setLoading(false)
                            return
                        }
                        toast("Thank you! The location has been changed!")
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
    var sub = Meteor.subscribe('additionals');
    const ready = sub.ready();
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')
    return {
        ready,
        original: Locations.findOne({ _id: id })
    };
})(EditLocation);
