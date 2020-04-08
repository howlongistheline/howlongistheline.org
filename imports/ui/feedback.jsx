import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Input, Select, ListItem, ListTitle, Button, Icon, ProgressCircular } from 'react-onsenui'
import { toast } from 'react-toastify';
import { withTracker } from 'meteor/react-meteor-data';
import { Locations } from '../api/lines.js';

export default function feedback({ history, details }) {

    const [feedback, setFeedback] = useState("");

    function submit() {

        if (feedback == "") {
            toast("Please Enter your feedback");
            return
        }
            Meteor.call('feedbacks.insert', feedback, function (err, result) {
                if (err) {
                    toast("Such error! If this keeps happening please report it.")
                    console.log(err)
                    return
                }
                // setLoading(false)
                toast("Thank You for your feedback!")
                history.push('/')
            });
    }

    return (
        <MainLayout>
            <div style={{ marginBottom: 55 }}>
            <ListTitle>
                Feedback
            </ListTitle>
            <ListItem>
                <p>Problems that are currently known and being worked on can be seen at <a href="https://github.com/howlongistheline/howlongistheline.org/issues">https://github.com/howlongistheline/howlongistheline.org/issues</a></p>
            </ListItem>
                 <ListItem>


                <Input
                        style={{ width: "80%" }}
                        value={feedback} float
                        onChange={(event) => { setFeedback(event.target.value) }}
                        modifier='material'
                        placeholder='Please leave your comment here and press Submit below. Leave your email address if you would like a reply.' />
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
