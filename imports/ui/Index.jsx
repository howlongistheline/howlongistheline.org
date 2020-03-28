import React from 'react'
import MainLayout from './MainLayout'
import { withTracker } from 'meteor/react-meteor-data';
import { Lines } from '../api/lines.js';
import { Meteor } from 'meteor/meteor';
import { Icon, Button, ListItem, ListTitle } from 'react-onsenui'

function Index({lines, history}) {    

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
        return lines.map((line) => {
            // console.log(line.createdAt)
            return (
            <ListItem key={line._id} tappable onClick={()=>{
            }}>
                <div className="left">{line.name + " : "}</div>
                <div className="center">{timeSince(line.createdAt)}</div>
                <div className="right">
                    {/* <Icon icon="md-chevron-right"></Icon>
                 */}
                 {statusToWord(line.status)}
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
    Meteor.subscribe('lines');
  
    return {
      lines: Lines.find({}, { sort: { createdAt: -1 } }).fetch(),
    //   currentUser: Meteor.user,
    };
  })(Index);