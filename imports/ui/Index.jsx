import React from 'react'
import MainLayout from './MainLayout'
import { withTracker } from 'meteor/react-meteor-data';
import { locations } from '../api/lines.js';
import { Meteor } from 'meteor/meteor';
import { Icon, Button, ListItem, ListTitle } from 'react-onsenui'

function Index({locations, history}) {    
    // console.log(navigator.geolocation)
    function statusToWord(statusCode){
        switch(statusCode){
            case "no":
                return <div style={{color:"green"}}>Good</div>
            case "small":
                return <div style={{color:"orange"}}>Not Great</div>
            case "long":
                return <div style={{color:"red"}}>Poor</div>
        }
    }

    function timeSince(date) {

        var seconds = Math.floor((new Date() - date) / 1000);
      
        var interval = Math.floor(seconds / 31536000);
      
        if (interval > 1) {
        //   return interval + " years";
        return "from " +date.toLocaleDateString()
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
        //   return interval + " months";
        return "from " +date.toLocaleDateString()
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return interval + " days";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return interval + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
      }

    function renderList() {
        return locations.map((location) => {
            return (
            <ListItem key={location._id} tappable onClick={()=>{
                history.push('/editLine?id='+location._id)
            }}>
                <div className="left">{location.name + " : "}</div>
                <div className="center">{timeSince(location.lastUpdate)}</div>
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
                    Locations
                </ListTitle>
                {renderList()}
                <Button modifier="large--cta" style={{ position: "fixed", bottom: 0, zIndex: 1000, minHeight: 50 }}
                    // type="submit" 
                    onClick={() => {history.push('/addLine')}}>
                    Add line
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