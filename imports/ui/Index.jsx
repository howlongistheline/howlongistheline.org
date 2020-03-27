import React from 'react'
import MainLayout from './MainLayout'
import { withTracker } from 'meteor/react-meteor-data';
import { Lines } from '../api/lines.js';
import { Meteor } from 'meteor/meteor';
import { Icon, Button } from 'react-onsenui'

function Index({lines}) {
    console.log(lines)

    function renderList() {
        return lines.map((line) => {
            return (
            <ListItem key={line._id} tappable onClick={()=>{
            }}>
                <div className="left">{line.name + " : "}</div>
                <div className="center">{line.location}</div>
                <div className="right">
                    <Icon icon="md-chevron-right"></Icon>
                </div>
            </ListItem>)
        })
    }

    return (
        <MainLayout>
                {renderList()}
                <Button modifier="large--cta" style={{ position: "fixed", bottom: 0, zIndex: 1000, minHeight: 50 }}
                    // type="submit" 
                    onClick={() => {}}>
                    Submit
                    <Icon icon='send' />
                </Button>
        </MainLayout>
    )
}


export default withTracker(() => {
    Meteor.subscribe('lines');
  
    return {
      lines: Lines.find({}, { sort: { createdAt: -1 } }).fetch(),
      currentUser: Meteor.user,
    };
  })(Index);