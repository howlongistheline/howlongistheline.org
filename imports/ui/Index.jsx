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

    function renderList() {
        return lines.map((line) => {
            return (
            <ListItem key={line._id} tappable onClick={()=>{
            }}>
                <div className="left">{line.name + " : "}</div>
                <div className="center"></div>
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