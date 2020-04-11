import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Input, Select, ListItem, ListTitle, Button, Icon, ProgressCircular } from 'react-onsenui'
import { toast } from 'react-toastify';
import { withTracker } from 'meteor/react-meteor-data';
import { Locations } from '../api/lines.js';

export default function feedback({ }) {

    return (
        <MainLayout>
            <ListTitle>
                Feedback
            </ListTitle>
            <ListItem>
                <p>Problems (and new features) that are currently known and being worked on can be seen at <a href="https://github.com/howlongistheline/howlongistheline.org/issues">https://github.com/howlongistheline/howlongistheline.org/issues</a></p>
                <p><a href="https://www.facebook.com/groups/1161156860891990/">Facebook group</a> that some of the volunteer developers sometimes hang around in.</p>
            </ListItem>
        </MainLayout>
    )
}
