import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import {Tracker} from 'meteor/tracker';
import { browserHistory } from 'react-router'; 
import { Link } from 'react-router';
import { TicketMaster } from '../../website/ServiceProcess/api/TicketMaster.js'; 
// import { Services } from '../reactCMS/api/Services.js';

class RoleTicketStatus extends TrackerReact(Component){   

constructor(props){
    super(props);
    this.state = {

      "subscription" : {
        "allTickets" : Meteor.subscribe("allTickets"), 
        "userfunction" : Meteor.subscribe('userfunction'),
      } 
    }
  }
  allocateToTeamMember(event){
      event.preventDefault();
      var allocateTo = this.refs.allocateToName.value;
      var allocateToSplit = allocateTo.split(" ");
      var firstName = allocateToSplit[0];
      var lastName  = allocateToSplit[1];

      var ticketDetails = this.props.getTicket;
      var ticketId = ticketDetails._id;
      var allocateToMemberDetails = ticketDetails.ticketElement[1];
    //   var allocateToMemberDetails.permanentAddress.status = "New";
      console.log(allocateToMemberDetails);
      Meteor.call('allocateToTeamMember',ticketId,firstName,lastName,allocateToMemberDetails,(error,result)=>{
            console.log(result);
      });
  }

  changeTMStatus(event){
      var ticketId = $(event.currentTarget).attr('data-id');
      var addressType = $(event.currentTarget).attr('data-addressType');
      var status      = $(event.currentTarget).attr('data-status');
      console.log(ticketId,addressType,status);
      Meteor.call('updateTMStatus',ticketId,addressType,status);
  }


  roleSwitch(roleStatus,role,empid){
    if (!this.props.loading) {

        var userDetails = Meteor.users.findOne({"_id":empid});
        var name = userDetails.profile.firstname +" "+userDetails.profile.lastname;
        var teammemberDetails = Meteor.users.find({"profile.reportToName":name}).fetch();
        var reportUserArr = [];
        if(teammemberDetails){
            for(k=0;k<teammemberDetails.length;k++){
                var newStr = teammemberDetails[k].profile.firstname+" "+teammemberDetails[k].profile.lastname;
                reportUserArr.push(newStr);
            }
        }
        switch(role){
            case 'team leader':
                    if((roleStatus == "Accepted") || (roleStatus == "Reassign")){
                        return(
                            <div>
                                <div className="col-lg-8">
                                <lable>Allocate To Field Expert</lable>
                                <select className="form-control allProductSubCategories" aria-describedby="basic-addon1" ref="allocateToName">
                                    { 
                                        reportUserArr.map( (data, index)=>{
                                            return (
                                                <option key={index}>
                                                    
                                                {data}
                                                </option>
                                            );
                                        })
                                    } 
                                </select>
                                </div>
                                <div className="col-lg-4 noLRPad">
                                    <button type="button" className="bg-primary col-lg-12 teammember" onClick={this.allocateToTeamMember.bind(this)}>Ok</button>
                                </div>
                            </div>
                        );
                    }
                    break;
            case 'team member':
                if(roleStatus == "New"){
                    return(
                        <div>
                            <button type="button" className="bg-primary col-lg-5 teammember" data-status="Accepted" data-addressType = {this.props.getTicket.addressType} data-id={this.props.ticketId} onClick={this.changeTMStatus.bind(this)}>Accept</button>
                            <button type="button" className="btn-danger col-lg-5 teammember" data-status="Rejected" data-addressType = {this.props.getTicket.addressType} data-id={this.props.ticketId} onClick={this.changeTMStatus.bind(this)}>Reject</button>
                        </div>
                    );
                }
                    

            }
        }
    

  }

  userData(){
  	var getTicket = TicketMaster.findOne({"_id" : this.props.ticketId});
    if (getTicket){
      var newCommeeteeArr = [];

      for(var i=0;i<getTicket.ticketElement.length;i++){

        var roleDetails = Meteor.users.findOne({"_id":getTicket.ticketElement[i].empid});
          newCommeeteeArr.push(
            <div key = {i} className="col-lg-12">
                <div className="ticketServiceWrapper col-lg-12 col-md-6 col-sm-6 col-xs-6">              
                        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 outerTickeBlock noPadLeftRight">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                <div className="col-lg-5 col-md-4 col-sm-4 col-xs-4 text-left userLabel">
                            State<span className="pull-right">:</span>
                                </div>  
                                <div className="col-lg-7 col-md-8 col-sm-8 col-xs-8 text-left userValue">
                                <p>{getTicket.ticketElement[i].role_status}</p>
                                </div> 
                            </div> 
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                <div className="col-lg-5 col-md-4 col-sm-4 col-xs-4 text-left userLabel">
                                Date :<span className="pull-right">:</span>
                                </div>  
                                <div className="col-lg-7 col-md-8 col-sm-8 col-xs-8 text-left userValue">
                                <p>{moment(getTicket.ticketElement[i].createdAt).format("DD/MM/YYYY")}</p> 
                                {/*  <p> - </p>*/}
                                </div>  
                            </div>  
                            <div>
                                {this.roleSwitch(getTicket.ticketElement[i].role_status, getTicket.ticketElement[i].role,getTicket.ticketElement[i].empid)}
                                
                            </div>
                        </div>
                </div>    
            </div>
          );
      }
      return newCommeeteeArr;
    
    }
  }
 
	render(){
    return(
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
         {/* <div className="userInformationWrapper col-lg-6 col-md-6 col-sm-6 col-xs-6"> */}
            {this.userData()}
          {/* </div>     */}
      </div>    
    );
   }
}
ticketContainer = withTracker(props => {
//   console.log('props: ',this.props);
    var _id = props.ticketId;
    // console.log("_id",_id);
    const postHandle = Meteor.subscribe('singleTicket',_id);
    const   userfunction = Meteor.subscribe('userfunction');
    
    const getTicket  = TicketMaster.findOne({"_id" : _id}) || {};  
    // console.log("getTicket",getTicket); 
   
    const loading = !postHandle.ready() && !userfunction.ready();

    // if(_id){
      return {
          loading  : loading,
          getTicket : getTicket,
          ticketId  : _id
      };
    // }
})(RoleTicketStatus);
export default ticketContainer;
