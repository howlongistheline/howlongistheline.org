import React, { useState, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Input, Select, ListItem, ListTitle, Button, Icon, ProgressCircular, Checkbox } from 'react-onsenui'
import { toast } from 'react-toastify';
import { locations, additionals, locationsIndex } from '../api/lines.js';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';

function ShopDetails({ details, additional, history }) {
    if(!details || !additional){
        return <MainLayout>
            <ProgressCircular indeterminate/>
        </MainLayout>

    }

    const [comment, setComment] = useState("");

    function statusToWord(statusCode) {
        switch (statusCode) {
            case "no":
                return <div style={{ color: "green" }}>No Lines!</div>
            case "small":
                return <div style={{ color: "orange" }}>A Wee Wait</div>
            case "long":
                return <div style={{ color: "red" }}>Busy. Stay Home.</div>
        }
    }

    function addComment(){
        if (comment == "") {
            toast("please enter comment");
            return
        }
        Meteor.call("locations.comment", details._id, comment, (err, result)=>{
            if(err){
                toast("error when comment")
                return
            }
            toast("success!")
        })

    }

    function renderComments(){
    
        return additional.comments.map((comment, idx) => {
            return (
                <ListItem key={idx}>
                    {comment.comment}
                    <div className="right">{moment(comment.time).fromNow()}</div>
                </ListItem>
            )
        })
    }


    function renderHistorys(){ 
        return additional.history.reverse().map((history, idx) => {
            return (
                <ListItem key={idx}>
                    {statusToWord(history.status)}
                    <div className="right">{moment(history.time).fromNow()}</div>
                </ListItem>
            )
        })
    }

    return (
        <MainLayout>
            <div style={{ marginBottom: 55 }}>
            <ListTitle>
            Shop Details
            </ListTitle>
            <ListItem modifier="nodivider">
                {details.name}
            </ListItem>
            <ListTitle>
            </ListTitle>
            <ListItem modifier="nodivider">
                {details.address}
            </ListItem>
            <ListTitle>
                Line Status: {statusToWord(details.status)}
            </ListTitle>
            <ListTitle style={{marginTop: 30}}>
                Comments:
            </ListTitle>
            <ListItem> 
                <Input
                style={{width:"80%"}}
                value={comment} float
                onChange={(event) => { setComment(event.target.value)} }
                modifier='material'
                placeholder='leave your comment' />
                <div className="right">
                 <Button onClick={()=>{addComment()}}>
                     <Icon icon="fa-send"></Icon>
                 </Button>
                </div>
            </ListItem>
                {renderComments()}
            <ListTitle style={{marginTop: 30}}>
                Historys:
            </ListTitle>
                {renderHistorys()}
            </div>
        </MainLayout>
    )
}

export default withTracker(() => {
    Meteor.subscribe('locations');
    Meteor.subscribe('additionals')
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')
    return {
        details: locations.findOne({_id: id}),
        additional: additionals.findOne({locationId: id}),
    };
})(ShopDetails);
