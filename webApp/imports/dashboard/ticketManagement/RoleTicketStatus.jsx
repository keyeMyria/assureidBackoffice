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
import AddImagesVideo from './AddImagesVideo.jsx';

class RoleTicketStatus extends TrackerReact(Component){   
constructor(props){
    super(props);
    this.state = {

      "subscription" : {
        "allTickets" : Meteor.subscribe("allTickets"), 
        "userfunction" : Meteor.subscribe('userfunction'),
      },
      'radioState':'Self', 
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
      var empid = $(event.currentTarget).attr('data-empid');
      
    //   console.log(allocateToMemberDetails);
      Meteor.call('allocateToTeamMember',ticketId,firstName,lastName,allocateToMemberDetails,empid,(error,result)=>{
          if(result){
            $('.allteamleader').hide();
          }
            // console.log(result);
      });
  }

  changeTMStatus(event){
      var ticketId = $(event.currentTarget).attr('data-id');
      var addressType = $(event.currentTarget).attr('data-addressType');
      var status      = $(event.currentTarget).attr('data-status');
      var empid       = $(event.currentTarget).attr('data-empId');
      var roleStatus = $(event.currentTarget).attr('role-status');
      console.log("role_status :"+roleStatus);
      Meteor.call('updateTMStatus',ticketId,addressType,status,empid,(error,result)=>{
        //   if(result){
        //       console.log("result after updateTMStatus:"+result);
        //       $('.hideacceptreject').hide();
        //   }
      });
      if( roleStatus!="New"){
        $('#hideacceptreject').hide();
      }
  }

  /*Get radio value and display dropdown and textbox*/
  getRadioValue(event){
    event.preventDefault();
    var radioValue = $(event.currentTarget).val();
    this.setState({
        'radioState':radioValue,
    });
  }

  uploadDocsDiv(event){
    event.preventDefault();
    $('#AddImagesVideo').css({"display" : "block"});
  }

  /*Add BA Details  */
  addBADetails(event){
    event.preventDefault();
    var addressType = $(event.currentTarget).attr( "data-addressType"); 
    var role        = $(event.currentTarget).attr('data-role');
    var ticketId    = $(event.currentTarget).attr('data-id');
    console.log(addressType,role,ticketId);
    if(role == "BA"){
        var baName = this.refs.BAName.value;        
        Meteor.call("addBADetails",baName,(error,result)=>{
            if(result){
                console.log(result);
                 $('#uploadDocs').css({"display" : "block"});
                 var id = result;
                 // this.setState({
                 //  "baid" : id,
                 // });s
                Meteor.call('genericTicketUpdate',addressType,role,ticketId,id,(error,result)=>{
                    if(result){
                        swal({
                                        title: "Assing Ticket!",
                                        text: "Successfully Assign",
                                        icon: "success",
                        });
            
                    }
                });
                $("#uploadDocs").css({"display" : "block"});
            }
        })
    }else if(role == "Field Expert"){
        var id = this.refs.allocateToFEName.value;  
        Meteor.call('genericTicketUpdate',addressType,role,ticketId,id,(error,result)=>{
            if(result){
                swal({
                                title: "Assing Ticket!",
                                text: "Successfully Assign",
                                icon: "success",
                });
    
            }
        });
        // $("#uploadDocs").css({"display" : "block"});
    }
    
  }

  roleSwitch(roleStatus,role,empid){
      
    var splitroleStatus = roleStatus.split(',');
     
    if (!this.props.loading && role != "BA") {
        var userDetails = Meteor.users.findOne({"_id":empid});
        if (userDetails) {
          var name = userDetails.profile.firstname +" "+userDetails.profile.lastname;
          var teammemberDetails = Meteor.users.find({"profile.reportToName":name}).fetch();
          var reportUserArr = [];
          if(teammemberDetails){
              for(k=0;k<teammemberDetails.length;k++){
                  var newStr = teammemberDetails[k].profile.firstname+" "+teammemberDetails[k].profile.lastname;
                  reportUserArr.push(newStr);
              }

          }
        }
        
        switch(role){
            case 'team leader':
                    if((splitroleStatus[0] == "New") || (splitroleStatus[0] == "Reassign")){
                        return(
                            <div>
                                <div className="col-lg-8 allteamleader">
                                <lable>Allocate To Team Member</lable>
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
                                <div className="col-lg-4 fesubmitouter noLRPad">
                                    <button type="button" className="fesubmitbtn col-lg-12 teammember" role-status={this.props.role_status} data-empid={empid} onClick={this.allocateToTeamMember.bind(this)}>Ok</button>
                                </div>
                            </div>
                        );
                    }
                    break;
            case 'team member':
                if(splitroleStatus[0] == "New"){
                    return(
                        <div className="hideacceptreject" id="hideacceptreject">
                            <button type="button" className="bg-primary col-lg-5 teammember" data-status="Accepted" data-empId = {empid} data-addressType = {this.props.getTicket.addressType} data-id={this.props.ticketId} role-status = {this.props.role_status} onClick={this.changeTMStatus.bind(this)}>Accept</button>
                            <button type="button" className="btn-danger col-lg-5 teammember" data-status="Rejected" data-empId = {empid} data-addressType = {this.props.getTicket.addressType} data-id={this.props.ticketId} role-status = {this.props.role_status} onClick={this.changeTMStatus.bind(this)}>Reject</button>
                        </div>
                    );
                    
                }else{
                   return(
                       <div>
                        <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="radio radiobtn col-lg-3 noLRPad">
                                <label className="noLRPad"><input type="radio" name="optradio" value="Self" className="optradio" checked={this.state.radioState ==="Self"} onChange={this.getRadioValue.bind(this)}/>Self</label>
                                </div>
                                <div className="radio col-lg-6 radiobtn noLRPad">
                                <label className="noLRPad"><input type="radio" name="optradio" value="Field Expert" className="optradio" checked={this.state.radioState ==="Field Expert"} onChange={this.getRadioValue.bind(this)}/>Field Expert</label>
                                </div>
                                <div className="radio radiobtn col-lg-3 noLRPad">
                                <label className="noLRPad"><input type="radio" name="optradio" value="BA" className="optradio" checked={this.state.radioState ==="BA"} onChange={this.getRadioValue.bind(this)}/>BA</label>
                                </div>
                        </div>
                        <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">                            
                                {
                                    this.state.radioState == 'Field Expert'?
                                            <div>
                                                <div className="col-lg-8">
                                                <lable>Allocate To Field Expert</lable>
                                                <select className="form-control allProductSubCategories" aria-describedby="basic-addon1" ref="allocateToFEName">
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
                                                <div className="col-lg-4 fesubmitouter noLRPad">
                                                     <button type="submit" value="Submit" className="col-lg-11 fesubmitbtn noLRPad" onClick={this.addBADetails.bind(this)} data-addressType = {this.props.getTicket.addressType} data-id={this.props.ticketId} data-role={this.state.radioState}>Submit</button>                                       
                                                </div>
                                            </div>
                                    : 
                                    this.state.radioState == 'BA'?
                                    <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                                    
                                        <div className="col-lg-7 noLRPad">
                                         <input type="text" name="baName" className="fesubmitbtn banametext" ref="BAName"/>
                                        </div>
                                    
                                        <div className="col-lg-3 noLRPad">                                        
                                         <button type="submit" value="Submit" className="col-lg-11 fesubmitbtn noLRPad" onClick={this.addBADetails.bind(this)} data-addressType = {this.props.getTicket.addressType} data-id={this.props.ticketId} data-role={this.state.radioState}>Submit</button>
                                         </div>
                                          <div className="col-lg-4 fesubmitouter noLRPad" id="uploadDocs" style={{"display" : "none"}}>                                        
                                            <button type="submit" value="Submit"  className="col-lg-12 noLRPad" onClick={this.uploadDocsDiv.bind(this)}>Upload Docs</button>
                                         </div>

                                    </div>
                                    :
                                    this.state.radioState == 'Self'?
                                    <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                                          <div className="col-lg-4 uploadDocs noLRPad" id="uploadDocs">                                        
                                            <button type="submit" value="Submit"  className="col-lg-12 noLRPad" onClick={this.uploadDocsDiv.bind(this)}>Upload Docs</button>
                                         </div>

                                    </div>
                                    :
                                    ""
                                }
                            </div>
                        </div>
                    );
                    
                }
                    

            }
        }
    

  }

  userData(){
      var getTicket = TicketMaster.findOne({"_id" : this.props.ticketId});
      var userId = Meteor.userId();
      var getUserData = Meteor.users.findOne({"_id":userId});

    if (getTicket){
        var newCommeeteeArr = [];
        var data            = {};
        var status          = [];
        var date            = [];
        var status_temp     = [];
        var finalarray      = [];
        var count           = 1;
        
        for(var i=0;i<getTicket.ticketElement.length;i++){
            if(getTicket.ticketElement[i].role!="BA"){
                
                if((i > 0 ) && ((getTicket.ticketElement[i].role == getTicket.ticketElement[i-1].role) && (getTicket.ticketElement[i].empid == getTicket.ticketElement[i-1].empid))){
              
                    newCommeeteeArr[i-count].status.push(getTicket.ticketElement[i].role_status + ','+moment(getTicket.ticketElement[i].createdAt).format("DD/MM/YYYY"));
                    count++;
                }else{
                    
                    var roleDetails = Meteor.users.findOne({"_id":getTicket.ticketElement[i].empid});
                    data = {
                        index  : i,
                        empid  : getTicket.ticketElement[i].empid,
                        role   : getTicket.ticketElement[i].role,
                        name   : roleDetails.profile.firstname + ' ' +roleDetails.profile.lastname,
                        status : [getTicket.ticketElement[i].role_status + ','+moment(getTicket.ticketElement[i].createdAt).format("DD/MM/YYYY")],
                       
                    };
                    newCommeeteeArr.push(data);
                }
            }
        }
        for(var i=0;i<newCommeeteeArr.length;i++){
            finalarray.push(
                <div key ={i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderBottomBlock noLRPad">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <h5 className="col-lg-9 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 noLRPad roleName">
                        {newCommeeteeArr[i].role}
                        </h5>
                        <div className="col-lg-8 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-left userLabel">
                                    Name <span className="pull-right">:</span>
                                </div>  
                                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 text-left userValue">
                                    <p>{newCommeeteeArr[i].name}</p>
                                </div> 
                            </div>
                            
                            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-left userLabel">
                                            Status/Date <span className="pull-right">:</span>
                                            </div>  
                            <div className="col-lg-6 col-md-6 col-sm-4 col-xs-4 text-left noLRPad userLabel">
                            
                            {
                                newCommeeteeArr[i].status.map((data1,index1)=>{
                                        return(  
                                            <div>                                        
                                            <div  key={index1} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">   
                                                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 text-left userValue">
                                                    <p className="statusStyle">{data1}</p>
                                                </div> 
                                            </div>      
                                            <div>
                                                {this.roleSwitch(data1,newCommeeteeArr[i].role,newCommeeteeArr[i].empid)}
                                            </div>
                                            </div>
                                        );
                                        

                                    })
                                        
                            }                                        
                            </div>
                        </div>
                    </div>
            </div>
            );
                    // break;
            }
        // }
    }
      return finalarray;
    
    }
 
	render(){
    return(
      <div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
            {this.userData()}
        </div> 
      
      </div>
   
    );
   }
}
ticketContainer = withTracker(props => {

    var _id = props.ticketId;
    const postHandle = Meteor.subscribe('singleTicket',_id);
    const   userfunction = Meteor.subscribe('userfunction');
    const getTicket  = TicketMaster.findOne({"_id" : _id}) || {};  
    const loading = !postHandle.ready() && !userfunction.ready();
      return {
          loading  : loading,
          getTicket : getTicket,
          ticketId  : _id
      };
})(RoleTicketStatus);
export default ticketContainer;