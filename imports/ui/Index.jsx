import React from 'react'
import MainLayout from './MainLayout'
import { withTracker } from 'meteor/react-meteor-data';
import { locations } from '../api/lines.js';
import { Meteor } from 'meteor/meteor';
import { Icon, Button, ListItem, ListTitle } from 'react-onsenui'
var moment = require('moment');

function Index({locations, history}) {

    function statusToWord(statusCode){
        switch(statusCode){
            case "no":
                return <div style={{color:"green"}}>No Lines!</div>
            case "small":
                return <div style={{color:"orange"}}>A wee wait</div>
            case "long":
                return <div style={{color:"red"}}>Busy. Go later.</div>
        }
    }

    function renderList() {
        return locations.map((location) => {
            return (
            <ListItem key={location._id} tappable onClick={()=>{
                history.push('/editLine?id='+location._id)
            }}>
                <div className="left">{location.name + " : "}</div>
                <div className="center">{moment(location.lastUpdate).fromNow()}</div>
                <div className="right">
                    {/* <Icon icon="md-chevron-right"></Icon>
                 */}
                 {statusToWord(location.status)}
                </div>
            </ListItem>)
        })
    }

    return (
        <MainLayout>
                <ListTitle>
                    Shops
                </ListTitle>
                {renderList()}
                <Button modifier="large--cta" style={{ position: "fixed", bottom: 0, zIndex: 1000, minHeight: 50 }}
                    // type="submit"
                    onClick={() => {history.push('/addLine')}}>
                    Add a new shop
                    <Icon style={{marginLeft: 10}} icon='fa-plus' />
                </Button>
        </MainLayout>
    )
}


export default withTracker(() => {
    Meteor.subscribe('locations');

    return {
      locations: locations.find({}, { sort: { lastUpdate: -1 } }).fetch(),
    //   currentUser: Meteor.user,
    };
  })(Index);
