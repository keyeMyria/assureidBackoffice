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
import UserInformation from './UserInformation.jsx';
import { TicketMaster } from '../../website/ServiceProcess/api/TicketMaster.js';
import { TempTicketReport } from "/imports/dashboard/ticketManagement/api/TempUpload.js";
import  ServiceInformation from './ServiceInformation.jsx';
import VerifiedDocuments from './VerifiedDocuments.jsx';
import ScreeningCommittee from '/imports/dashboard/ticketManagement/ScreeningCommittee.jsx';
import TicketDocumentDetails from '/imports/dashboard/ticketManagement/TicketDocumentDetail.jsx';
import DocumentStatus from './DocumentStatus.jsx';
import VerificationDataSubmit from './VerificationDataSubmit.jsx';
import VerifyDetailsDocument from './VerifyDetailsDocument.jsx';
import { UserProfile } from '../../website/forms/api/userProfile.js';
import SubmittedDocuments from './SubmittedDocuments.jsx';
import UploadReport from './UploadReport.jsx';

class Ticket extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state = {
      'userDetails': {},
      "userRoleIn": Meteor.userId(),
      "showRejectBox" : 'N',
    }    
  }
  componentWillReceiveProps(nextProps){

    if(!nextProps.loading){
      this.setState({
        'userDetails':nextProps.user,
      });
    }    
  }
  viewprofile(event){
    event.preventDefault();
    var path = $(event.target).attr('data-userid');
    browserHistory.replace('/admin/viewProfile/'+path);
  }
  getRole(role) {
    return role != "backofficestaff";
  }
  showRejectBoxState(){
    this.setState({"showRejectBox" : 'Y'});
  }
  getRejectBox(){
    console.log('showRejectBox: ' + this.state.showRejectBox);
    // var roleStatus = $(event.currentTarget).attr('data-roleStatus');
    return(
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <textarea rows="3" cols="60" className="col-lg-6 col-lg-offset-0" id="rejectReason"/>
        <button onClick={this.rejectButton.bind(this)} 
          id="rejectButton" 
          // data-roleStatus = {roleStatus}
          // data-msg = {$(event.currentTarget).attr('data-msg')}
          className="col-lg-2 rejectSubmit"> 
          Submit </button>
      </div>
    )
  }
  rejectButton(event){
    event.preventDefault();
    var ticketId = this.props.ticketId;
    var elementLength = this.props.getTicket.ticketElement.length;
    switch(this.props.getTicket.ticketElement[elementLength-1].roleStatus){
      case 'Assign' :
        var roleStatus          = $('#TMRejectTicket').attr('data-roleStatus');
        var msg                 = $('#TMRejectTicket').attr('data-msg');
        var allocatedToUserid   = this.props.getTicket.ticketElement[elementLength-1].userId;
        var allocatedToUserName = this.props.getTicket.ticketElement[elementLength-1].userName;
        break;
      case 'ProofSubmit' :
        var roleStatus          = $('#TMProofReject').attr('data-roleStatus');
        var msg                 = $('#TMProofReject').attr('data-msg');
        var allocatedToUserid   = this.props.getTicket.ticketElement[elementLength-1].allocatedToUserid;
        var allocatedToUserName = this.props.getTicket.ticketElement[elementLength-1].allocatedToUserName;
        break;
      case 'VerificationPassQTMAllocated' : 
        var roleStatus          = $('#QTMRejectTicket').attr('data-roleStatus');
        var msg                 = $('#QTMRejectTicket').attr('data-msg');
        var ticketElements      = this.props.getTicket.ticketElement;  
        var teamMemberDetails   = ticketElements.find(function (obj) { return obj.roleStatus == 'ReportSubmitted' });
        var allocatedToUserid   = teamMemberDetails.userId;
        var allocatedToUserName = teamMemberDetails.userName;
        break;
      case 'QAPassQTLAllocated' :
        var roleStatus          = $('#QTLRejectTicket').attr('data-roleStatus');
        var msg                 = $('#QTLRejectTicket').attr('data-msg');
        var ticketElements      = this.props.getTicket.ticketElement;  
        var teamMemberDetails   = ticketElements.find(function (obj) { return obj.roleStatus == 'VerificationPassQTMAllocated' });
        var allocatedToUserid   = teamMemberDetails.allocatedToUserid;
        var allocatedToUserName = teamMemberDetails.allocatedToUserName; 
        break;
      case 'ReviewFail' :
        var roleStatus          = $('#QTMReRejectTicket').attr('data-roleStatus');
        var msg                 = $('#QTMReRejectTicket').attr('data-msg');
        var ticketElements      = this.props.getTicket.ticketElement;  
        var teamMemberDetails   = ticketElements.find(function (obj) { return obj.roleStatus == 'ReportSubmitted' });
        var allocatedToUserid   = teamMemberDetails.userId;
        var allocatedToUserName = teamMemberDetails.userName;
        break;
      default :
        break;
    }
    var insertData = {
      "userId"              : Meteor.userId(),
      "userName"            : Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname,
      "allocatedToUserid"   : allocatedToUserid,
      "allocatedToUserName" : allocatedToUserName,
      "role"                : Meteor.user().roles.find(this.getRole),
      "roleStatus"          : roleStatus,
      "msg"                 : msg,
      "remark"              : $('#rejectReason').val(),
      "createdAt"           : new Date()
    }
    // console.log('insertData ',insertData);
    Meteor.call('genericUpdateTicketMasterElement',this.props.ticketId,insertData);
    this.setState({"showRejectBox" : 'N'});
  }
  /*Get radio value and display dropdown and textbox*/
  getRadioValue(event){
    event.preventDefault();
    var radioValue = $(event.currentTarget).val();
    this.setState({
        'radioState':radioValue,
    });
    console.log("radioState :"+this.state.radioState);
  }
  showBAFEList(role){
    var teammemberDetails = Meteor.users.find({"roles": {$in:[role]}}).fetch();
    return teammemberDetails;
  }
  uploadDocsDiv(event){
    event.preventDefault();
    $('#AddImagesVideo').css({"display" : "block"});
    $(event.currentTarget).css({"display" : "none"});
  }
  handleReportUpload(event){
    event.preventDefault();
    let self = this;
    if (event.currentTarget.files && event.currentTarget.files[0]) { 
      console.log('report ', event.currentTarget.files);
      console.log('report1 ', event.currentTarget.files[0]);
      var dataImg =event.currentTarget.files[0];
        if(dataImg){
          console.log('dataImg ',dataImg);      
        var reader = new FileReader();       
        reader.onload = function (e) {          
        };      
        reader.readAsDataURL(event.currentTarget.files[0]);      
        var file = event.currentTarget.files[0];
        if (file) {         
                addReportFunction(file,self);       
            }
        };
        } else { 
        swal({    
            position: 'top-right',     
            type: 'error',    
            title: 'Please select Video',       
            showConfirmButton: false,      
            timer: 1500      
        });   
    }
  }
  approveButton(event){
    event.preventDefault();
    var ticketId = this.props.ticketId;
    var elementLength = this.props.getTicket.ticketElement.length;
    var insertData = {
      "userId"              : Meteor.userId(),
      "userName"            : Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname,
      "role"                : Meteor.user().roles.find(this.getRole),
      "roleStatus"          : $(event.currentTarget).attr('data-roleStatus'),
      "msg"                 : $(event.currentTarget).attr('data-msg'),
      "createdAt"           : new Date()
    }
    var memberid ='';
    var memberName = '';

    switch(this.props.getTicket.ticketElement[elementLength-1].roleStatus){
      case 'screenTLAllocated' :
      case 'ReAssign' :
      case 'AssignReject' :
        insertData.allocatedToUserid = $("#selectTMMember option:selected").val();
        insertData.allocatedToUserName = $("#selectTMMember option:selected").text();
        break;
      case 'Assign' :
      case 'ProofSubmit' : 
        insertData.allocatedToUserid   = '';
        insertData.allocatedToUserName = '';
        break;
      case 'AssignAccept':
        if(($(event.currentTarget).attr('data-roleStatus') == 'FEAllocated') || ($(event.currentTarget).attr('data-roleStatus') == 'BAAllocated')){
            insertData.allocatedToUserid = $("#selectMember option:selected").val();
            insertData.allocatedToUserName = $("#selectMember option:selected").text();
         }else{
            insertData.allocatedToUserid = this.props.getTicket.ticketElement[elementLength-1].allocatedToUserid;
            insertData.allocatedToUserName = this.props.getTicket.ticketElement[elementLength-1].allocatedToUserName;
        }
        break;
      case 'VerificationPass' :
        if(!this.props.loading){
            var reportLinkDetails = TempTicketReport.findOne({},{sort:{'createdAt':-1}});  
            if(reportLinkDetails){
              insertData.reportSubmited = reportLinkDetails.ReportLink;
            } 
        }
        insertData.allocatedToUserid   = '';
        insertData.allocatedToUserName = '';
        console.log('report submitted ',insertData);
        break;
      case 'ReportReSubmitted' :
        if(!this.props.loading){
            console.log('in loading');
            var reportLinkDetails = TempTicketReport.findOne({},{sort:{'createdAt':-1}});  
            if(reportLinkDetails){
              console.log('in loading');
              insertData.reportSubmited = reportLinkDetails.ReportLink;
              console.log('report link',reportLinkDetails.ReportLink);
              console.log('report ',insertData.reportSubmited);
            } 
        }
        var ticketElements      = this.props.getTicket.ticketElement;  
        var teamMemberDetails   = ticketElements.find(function (obj) { return obj.roleStatus == 'QAFail' });
        var allocatedToUserid   = teamMemberDetails.userid;
        var allocatedToUserName = teamMemberDetails.userName;
        break;
      case 'VerificationPassQTLAllocated' :
        insertData.allocatedToUserid = this.props.getTicket.ticketElement[0].userId;
          insertData.allocatedToUserName = this.props.getTicket.ticketElement[0].userName;
        break;
      default :
        insertData.allocatedToUserid   = '';
        insertData.allocatedToUserName = '';
        break;
    }
    // console.log('insertData ',insertData);
    Meteor.call('genericUpdateTicketMasterElement',this.props.ticketId,insertData);
  }
  actionBlock(){
    var n = this.props.getTicket.ticketElement.length;
    var reportLinkDetails = TempTicketReport.findOne({},{sort:{'createdAt':-1}});  
    if(reportLinkDetails){
      var reportLink = reportLinkDetails.ReportLink;
    } 
    
    switch(this.props.getTicket.ticketElement[n-1].roleStatus){
      case 'screenTLAllocated' :
        if(Meteor.user().roles.find(this.getRole) == 'team leader' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){
          var teamMemberList=[];
          var title = "Team Leader";
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper"> 
              <h5> {title} </h5>
              <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12">
                <span className="col-lg-3 col-md-3 col-sm-4 col-xs-5"> Assign this ticket to: </span>
                <select className="col-lg-3 col-md-3 col-sm-4 col-xs-5 tmListWrap" id="selectTMMember" aria-describedby="basic-addon1" ref="allocateToName">  
                  { 
                    this.showBAFEList('team member').map((data,i)=>{
                      return(
                        <option key={i} value={data._id}>
                          {data.profile.firstname + ' ' + data.profile.lastname}
                        </option>
                      );
                    })
                  } 
                </select>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 fesubmitouter noLRPad">
                  <button type="submit" value="Submit" className="col-lg-11 fesubmitbtn noLRPad" data-role="Team Leader" data-roleStatus="Assign" data-msg="Assigned Ticket To Team Member" onClick={this.approveButton.bind(this)} >Submit</button>                                       
                </div>
              </div>
            </div>
          )
        }
        break;
      case 'ReAssign' :
        if(Meteor.user().roles.find(this.getRole) == 'team leader' && this.props.getTicket.ticketElement[n-1].userId == Meteor.userId()){
          var teamMemberList=[];
          var title = "Team Leader";
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper"> 
              <h5> {title} </h5>
              <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12">
                <span className="col-lg-3 col-md-3 col-sm-4 col-xs-5"> Assign this ticket to: </span>
                <select className="col-lg-3 col-md-3 col-sm-4 col-xs-5 tmListWrap" id="selectTMMember" aria-describedby="basic-addon1" ref="allocateToName">  
                  { 
                    this.showBAFEList('team member').map((data,i)=>{
                      return(
                        <option key={i} value={data._id}>
                          {data.profile.firstname + ' ' + data.profile.lastname}
                        </option>
                      );
                    })
                  } 
                </select>
                <div className="col-lg-3 fesubmitouter noLRPad">
                  <button type="submit" value="Submit" className="col-lg-11 fesubmitbtn noLRPad" data-role="Team Leader" data-roleStatus="Assign" data-msg="Assigned Ticket To Team Member" onClick={this.approveButton.bind(this)} >Submit</button>                                       
                </div>
              </div>
            </div>
          )
        }
        break;
      case 'AssignReject' :
        if(Meteor.user().roles.find(this.getRole) == 'team leader' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){
          var teamMemberList=[];
          var title = "Team Leader";
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper"> 
              <h5> {title} </h5>
              <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12">
                <span className="col-lg-3 col-md-3 col-sm-4 col-xs-5"> Assign this ticket to: </span>
                <select className="col-lg-3 col-md-3 col-sm-4 col-xs-5 tmListWrap" id="selectTMMember" aria-describedby="basic-addon1" ref="allocateToName">  
                  { 
                    this.showBAFEList('team member').map((data,i)=>{
                      return(
                        <option key={i} value={data._id}>
                          {data.profile.firstname + ' ' + data.profile.lastname}
                        </option>
                      );
                    })
                  } 
                </select>
                <div className="col-lg-3 fesubmitouter noLRPad">
                  <button type="submit" value="Submit" className="col-lg-11 fesubmitbtn noLRPad" data-role="Team Leader" data-roleStatus="Assign" data-msg="Assigned Ticket To Team Member" onClick={this.approveButton.bind(this)} >Submit</button>                                       
                </div>
              </div>
            </div>
          )
        }
        break;
      case 'Assign' :
        if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){
          var title = "Team Member";  
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper"> 
              <h5> {title} </h5> 
              <span>Please accept if your are going to work on this ticket. If rejected please provide appropriate reason.</span>
              <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 acceptrejectwrap">
                <button className="btn btn-danger approvebtn col-lg-3 col-md-3 col-sm-4 col-xs-5" id="TMRejectTicket" data-roleStatus="AssignReject" data-msg="Rejected Ticket and returned back to " onClick={this.showRejectBoxState.bind(this)}> 
                  Reject 
                </button>
                <button className="btn btn-success col-lg-3 col-md-3 col-sm-4 col-xs-5 approvebtn" data-roleStatus="AssignAccept" data-msg="Accepted Ticket" onClick={this.approveButton.bind(this)} > 
                      Accept </button>
              </div>
              {this.state.showRejectBox === 'Y' ? this.getRejectBox() : '' }
            </div>
          )
        }
        break;
      case 'AssignAccept' :
        if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].userId == Meteor.userId()){
          console.log("in team Member");
          var title = "Team Member";
          var data = [];
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper"> 
              <h5> {title} </h5>
              <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12">
                <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper ">
                    <div className="radio radiobtn col-lg-3 noLRPad">
                      <label className="noLRPad">
                        <input type="radio" name="radioState" value="Self" className="optradio" onChange={this.getRadioValue.bind(this)}/>Self
                      </label>
                    </div>     
                    <div className="radio col-lg-5 radiobtn noLRPad">
                      <label className="noLRPad">
                        <input type="radio" name="radioState" value="field expert" className="optradio" onChange={this.getRadioValue.bind(this)}/>Field Expert
                      </label>
                    </div>
                    <div className="radio radiobtn col-lg-4 noLRPad">
                      <label className="noLRPad">
                        <input type="radio" name="radioState" value="ba" className="optradio" onChange={this.getRadioValue.bind(this)}/>Business Associate
                      </label>
                    </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad hideFieldexpert selfallocatedwrap">                            
                  {this.state.radioState == 'field expert'?       
                    <div>
                        <div className="col-lg-7 teamMemOuter">
                          <lable>Allocate To Field Expert</lable>
                          <select className="form-control" id="selectMember" aria-describedby="basic-addon1" ref="allocateToFEName">
                              { 
                                this.showBAFEList('field expert').map((data,i)=>{
                                  return(
                                    <option key={i} value={data._id}>
                                      {data.profile.firstname + ' ' + data.profile.lastname}
                                    </option>
                                  );
                                })
                              } 
                          </select>
                        </div>
                        <div className="col-lg-4 fesubmitouter noLRPad">
                          <lable>&nbsp;</lable>
                          <button type="submit" value="Submit" className="col-lg-11 feSubmitbtn noLRPad" data-role="field expert" data-roleStatus="FEAllocated" data-msg="Allocated Ticket To Field Expert" onClick={this.approveButton.bind(this)} >Submit</button>                                       
                        </div>
                    </div>
                  :this.state.radioState == 'ba'?       
                  <div>
                      <div className="col-lg-7 teamMemOuter">
                        <lable>Allocate To Business Associate</lable>
                        <select className="form-control" id="selectMember" aria-describedby="basic-addon1" ref="allocateToFEName">
                            { 
                              this.showBAFEList('ba').map((data,i)=>{
                                return(
                                  <option key={i} value={data._id}>
                                    {data.profile.firstname + ' ' + data.profile.lastname}
                                  </option>
                                );
                              })
                            } 
                        </select>
                      </div>
                      <div className="col-lg-4 fesubmitouter noLRPad">
                        <button type="submit" value="Submit" className="col-lg-11 feSubmitbtn  noLRPad" data-role="Business Associate" data-roleStatus="BAAllocated" data-msg="Allocated Ticket To Business Associate" onClick={this.approveButton.bind(this)} >Submit</button>                                       
                      </div>
                  </div>
                  : this.state.radioState == 'Self'?
                    <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 selfallocatedwrap noLRPad">
                      <h5><strong>You are going to handle this ticket</strong></h5>
                      <button type="submit" value="Submit" className="col-lg-5 col-lg-offset-3 col-md-5 col-md-offset-3 col-lg-12 col-xs-12 selfsubmit noLRPad" data-role="team member" data-roleStatus="SelfAllocated"  data-msg="Allocated Ticket To Self" onClick={this.approveButton.bind(this)} >Submit</button>                                                                              
                  </div>
                  :    ""
                  }
                </div>
              </div>
            </div> 
          )
        }
        break; 
      case 'SelfAllocated' :
        if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].userId == Meteor.userId()){
          var title = "Team Member";  
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper"> 
              <h5> {title} </h5>

              <div id="uploadButtonDiv" className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12">
                <button className="btn btn-primary col-lg-7 col-md-7 col-sm-12 col-xs-12"  onClick={this.uploadDocsDiv.bind(this)} > 
                      Upload Documents & Remark</button>  
              </div>
              <div id="AddImagesVideo" style={{"display":"none"}}>
                {<VerificationDataSubmit ticketId={this.props.ticketId}/>}
              </div>
            </div>
          )
        }
        break;
      case 'ProofSubmit' :
        if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){
          var title = "Team Member";  
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper"> 
              <h5> {title} </h5>
              <span> Do you accept the Information Regarding the Ticket</span>
              <div className="docbtnwrap col-lg-6 col-lg-offset-4">
                <button type="button" className="btn btn-danger col-lg-4 ApprovRejDoc" id="TMProofReject" data-roleStatus="VerificationFail" data-msg="Rejected Verification Information from" onClick={this.showRejectBoxState.bind(this)}>Reject</button>
                <button type="button" className="btn btn-success col-lg-4 ApprovRejDoc" data-roleStatus="VerificationPass" data-msg="Approved Verification Information" onClick ={this.approveButton.bind(this)}>Approve</button>
              </div>
              {this.state.showRejectBox === 'Y' ? this.getRejectBox() : '' }
            </div>
          )
        }
        break;
      case 'ProofResubmitted' :
        if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){
          var title = "Team Member";  
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper"> 
              <h5> {title} </h5>
              <span> Do you accept the Information Regarding the Ticket</span>
              <div className="docbtnwrap col-lg-6 col-lg-offset-4">
                <button type="button" className="btn btn-danger col-lg-4 ApprovRejDoc" id="TMProofReject" data-roleStatus="VerificationFail" data-msg="Rejected Verification Information from" onClick={this.showRejectBoxState.bind(this)}>Reject</button>
                <button type="button" className="btn btn-primary col-lg-4 ApprovRejDoc" data-roleStatus="VerificationPass" data-msg="Approved Verification Information" onClick ={this.approveButton.bind(this)}>Approve</button>
              </div>
              {this.state.showRejectBox === 'Y' ? this.getRejectBox() : '' }
            </div>
          )
        }
        break;
      case 'VerificationPass' :
        if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].userId == Meteor.userId()){
          var title = "Team Member";  
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper"> 
              <h5> {title} </h5>
              <span>Upload Report : </span>
              <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-xm-12 col-xs-12">
                <div className="col-lg-6 col-lg-offset-1">
                    <input type="file" ref="uploadReportFile" id="uploadReport" name="uploadReport" className="col-lg-7 reporttitle noLRPad" onChange={this.handleReportUpload.bind(this)} multiple/>
                </div>
                <div className="col-lg-4">
                    <button type="button" className="fesubmitbtn col-lg-5" data-roleStatus="ReportSubmitted" data-msg="Submitted Verification Information" onClick={this.approveButton.bind(this)}>Submit</button>
                </div>
              </div>
            </div>
          )
        }
        break;
      case 'VerificationPassQTMAllocated' :
        if(Meteor.user().roles.find(this.getRole) == 'quality team member' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){
          var title = "Qulity Team Member";  
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper"> 
              <h5> {title} </h5>
                
              <h6>Submitted Report</h6>
                <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12">
                  <div className="docdownload col-lg-3 col-lg-offset-1" title="Download Report">
                      <a href={this.props.getTicket.reportSubmited.documents} download>
                        <i className="fa fa-file-text-o" aria-hidden="true"></i>
                      </a>
                  </div>
                  <lable className=" col-lg-9 col-md-9 col-sm-12 col-xs-12 downloadLable">Download Report</lable>
                 </div> 
                <div className="col-lg-7 col-lg-offset-0 col-md-7 col-md-offset-0 col-xm-12 col-xs-12">
                <span>Is the Report appropriate ? </span>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 acceptrejectwrap">
                  <button className="btn btn-danger col-lg-3 col-md-3 col-sm-4 col-xs-5 approvebtn" id="QTMRejectTicket" data-roleStatus="QAFail" data-msg="Rejected Verification Report For Quality Issue" onClick={this.showRejectBoxState.bind(this)} > 
                    Reject 
                  </button>
                  <button className="btn btn-success col-lg-3 col-md-3 col-sm-4 col-xs-5 approvebtn" data-roleStatus="QAPass" data-msg="Approved Verification Report" onClick={this.approveButton.bind(this)} > 
                        Approve </button>
                </div>
               {this.state.showRejectBox === 'Y' ? this.getRejectBox() : '' }
              </div>
              </div>        
          )
        }
        break;
      case 'QAFail' :
        if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){
          var title = "Team Member";  
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper"> 
              <h5> {title} </h5>
              
              <div className="col-lg-10 col-md-10 col-md-offset-0 col-xm-12 col-xs-12">
                <h6>Submitted Report</h6>
                <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12">
                  <div className="docdownload col-lg-3 col-lg-offset-1" title="Download Previous Report">
                      <a href={this.props.getTicket.reportSubmited.documents} download>
                        <i className="fa fa-file-text-o" aria-hidden="true"></i>
                      </a>
                  </div>
                  <lable className=" col-lg-9 col-md-9 col-sm-12 col-xs-12 downloadLable">Download Previous Report</lable>
                </div>
                <span>Upload Report : </span>
                <div className="col-lg-7 col-lg-offset-0 col-md-7 col-md-offset-0 col-sm-10 col-sm-offset-1 col-xs-12">
                  <div className="">
                      <input type="file" ref="uploadReportFile" id="uploadReport" name="uploadReport" className="col-lg-7 reporttitle noLRPad" onChange={this.handleReportUpload.bind(this)} multiple/>
                  </div>
                  <div className="col-lg-5">
                      <button type="button" className="fesubmitbtn col-lg-5" data-roleStatus="ReportReSubmitted" data-msg="Re-Submitted Verification Information" onClick={this.approveButton.bind(this)}>Submit</button>
                  </div>
                </div>
                
              </div>
            </div>
          )
        }
        break;
      case 'QAPassQTLAllocated' :
        if(Meteor.user().roles.find(this.getRole) == 'quality team leader' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){
          var title = "Qulity Team Leader";  
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper"> 
              <h5> {title} </h5>
              
              <div className="col-lg-10 col-md-10 col-md-offset-0 col-xm-12 col-xs-12">
                <h6>Submitted Report</h6>
                <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12">
                  <div className="docdownload col-lg-3 col-lg-offset-1" title="Download Report">
                      <a href={this.props.getTicket.reportSubmited.documents} download>
                        <i className="fa fa-file-text-o" aria-hidden="true"></i>
                      </a>
                  </div>
                  <lable className=" col-lg-9 col-md-9 col-sm-12 col-xs-12 downloadLable">Download Report</lable>
                </div>
                  <span>Is the Report appropriate ? </span>
                <div className="col-lg-6 col-lg-offset-0 col-md-6 col-md-offset-0 col-sm-10 col-sm-offset-1 col-xs-12">

                  <button className="btn btn-danger col-lg-3 col-md-3 col-sm-4 col-xs-5 approvebtn" id="QTLRejectTicket" data-roleStatus="ReviewFail" data-msg="Rejected Verification Report For Quality Issue" onClick={this.showRejectBoxState.bind(this)} > 
                    Reject 
                  </button>
                  <button className="btn btn-success col-lg-3 col-md-3 col-sm-4 col-xs-5 approvebtn" data-roleStatus="ReviewPass" data-msg="Approved And Delivered Verification Report" onClick={this.approveButton.bind(this)} > 
                        Approve </button>
                </div>
                {this.state.showRejectBox === 'Y' ? this.getRejectBox() : '' }
              </div>
            </div>
          )
        }
        break;
      case 'ReviewFail' :
        if(Meteor.user().roles.find(this.getRole) == 'quality team member' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){
          var title = "Qulity Team Member";  
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper"> 
              <h5> {title} </h5>
              
              <div className="col-lg-10 col-md-10 col-md-offset-0 col-xm-12 col-xs-12">
                <h6>Submitted Report</h6>
                <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12">
                  <div className="docdownload col-lg-3 col-lg-offset-1" title="Download Report">
                      <a href={this.props.getTicket.reportSubmited.documents} download>
                        <i className="fa fa-file-text-o" aria-hidden="true"></i>
                      </a>
                  </div>
                  <lable className=" col-lg-9 col-md-9 col-sm-12 col-xs-12 downloadLable">Download Report</lable>
                </div>
                <span>Is the Report appropriate ? </span>
                <div className="col-lg-6 col-lg-offset-0 col-md-6 col-md-offset-0 col-sm-10 col-sm-offset-1 col-xs-12">
                  <button className="btn btn-danger col-lg-3 col-md-3 col-sm-4 col-xs-5 approvebtn" id="QTMReRejectTicket" data-roleStatus="QAFail" data-msg="Rejected Verification Report For Quality Issue" onClick={this.showRejectBoxState.bind(this)} > 
                    Reject 
                  </button>
                  <button className="btn btn-success col-lg-3 col-md-3 col-sm-4 col-xs-5 approvebtn" data-roleStatus="QAPass" data-msg="Re-Approved Verification Report" onClick={this.approveButton.bind(this)} > 
                        Approve </button>
                </div>
                {this.state.showRejectBox === 'Y' ? this.getRejectBox() : '' }
              </div>
            </div>
          )
        }else if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){

        }
        break;
    }
  }

	render(){
    if(!this.props.loading){
      return(            
        <div>
          <div className="content-wrapper">
            <section className="content">
              <div className="row">
                <div className="col-md-12">
                  <div className="box">
                    <div className="box-header with-border">
                      <h2 className="box-title">Ticket</h2> 
                    </div>
                    <div className="box-body">
                       <div className="ticketWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="ticketHeader col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="ticketBorder col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 noLRPad">
                                  <img src="/images/assureid/Assure-ID-logo-Grey.png" className="assureidLogo" />
                              </div>
                            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 text-right outerTicketIcons">
                                <i className="fa fa-print ticketIcons" title="Print"></i>  
                                <i className="fa fa-file-pdf-o ticketIcons"  title="pdf"></i> 
                                <i className="fa fa-download ticketIcons" title="Download"></i> 
                            </div>
                            </div> 
                          </div>

                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">

                            <h3 className="ticketheadStyle col-lg-12">{this.props.getTicket.serviceName}/{this.props.getTicket.ticketNumber}</h3>
                          </div>
                          <div className="ticketPills col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 noLRPad">
                              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                { this.props.userProfile.userProfile ?
                                  <img src={this.props.userProfile.userProfile } className="ticketUserImage" /> :
                                  <img src="/images/assureid/userIcon.png" className="ticketUserImage" /> 
                                }
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight assureidValue">
                                    <button type="button" className="btn viewbtn" data-userid={this.props.user._id} onClick= {this.viewprofile.bind(this)}>View</button>
                                </div>
                              </div>
                              <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                  {/* <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-left userLabel">
                                  Name <span className="pull-right">:</span>
                                  </div>   */}
                                  <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 text-left userName">
                                    <h5>{this.props.userProfile.firstName} {this.props.userProfile.lastName}</h5>
                                  </div> 
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                  <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left  userLabel">
                                  Assure ID <span className="pull-right">:</span>
                                  </div>  
                                  <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                                   
                                    <p>{this.props.userProfile.assureId}</p>
                                  </div> 
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                  <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left userLabel">
                                 Mobile <span className="pull-right">:</span>
                                  </div>  
                                  <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                                  {/* <p>{this.state.userDetails.emails[0].address}</p> */}
                                    <p>+91{this.props.userProfile.mobileNo}</p>
                                  </div> 
                                </div>

                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                  <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left userLabel">
                                  Email Id <span className="pull-right">:</span>
                                  </div>  
                                  <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                                    <p>{this.props.userProfile.emailId}</p>
                                  </div> 
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                  <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left userLabel">
                                  Age<span className="pull-right">:</span>
                                  </div>  
                                   <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                                    <p>{this.props.userProfile.dateOfBirth}&nbsp;Year</p>
                                  </div> 
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                  <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left userLabel">
                                  Gender <span className="pull-right">:</span>
                                  </div>  
                                  <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                                    <p className="genName">{this.props.userProfile.gender}</p>
                                  </div> 
                                </div>
                               
                              </div>
                              {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-right viewProfileLink noPadLeftRight">
                                <Link>View profile</Link>
                              </div> */}
                         </div>
                         <div className="col-lg-6">
                         <ServiceInformation ticketId={this.props.params.id}/>
                         </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <VerifyDetailsDocument ticketId={this.props.params.id}/>
                        </div>
                        <VerifiedDocuments ticketId={this.props.params.id}/>
                        <div id="SubmittedDocuments" >
                          {this.props.getTicket.submitedDoc ?
                            <SubmittedDocuments submittedDocuments={this.props.getTicket.submitedDoc} ticketId={this.props.params.id} />
                            :
                            ""
                          }
                        </div>
                         <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerShadow">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 activityDetails">                            
                                  <h3> Activities</h3>
                              </div>
                              {this.actionBlock()}
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                                {this.props.getTicket.ticketElement.slice(0).reverse().map((element,i)=>{
                                   return ( 
                                    <div key={i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper"> 
                                      <h5> {element.role} </h5>
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                                      <b>{element.userName}</b> {element.msg} <b>{element.allocatedToUserName}</b> on {moment(element.createdAt).format("DD/MM/YYYY hh:mm A")}
                                        <br />
                                        {
                                          element.remark ?
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                              <span>Remark &nbsp;:</span><span>{element.remark}</span> 
                                            </div>
                                          :
                                          ""
                                        }
                                      </div>  
                                    </div>
                                    )
                                  })
                                }
                              </div>
                            </div>
                          </div>
                       </div>
                       </div>
                       </div> 
                    </div>
                  </div>
                </div>
              {/* </div> */}
            </section>
          </div>
        </div>    
      );
    }else{
      return(<span>loading...</span>);
    }

   }
}

export default UserDetailsContainer = withTracker(props => {
  var handleSinTick = Meteor.subscribe("singleTicket",props.params.id);
  var handleUseFunc = Meteor.subscribe('userfunction');
  var handleUserProfile = Meteor.subscribe("userProfileData");
  var handleReport    = Meteor.subscribe("allTicketReport");

  var ticketId = props.params.id;
  var loading = !handleSinTick.ready() && !handleUseFunc.ready() && !handleUserProfile.ready() && !handleReport.ready();
  var getTicket = TicketMaster.findOne({"_id":ticketId}) ;
  if(getTicket){
    var user = Meteor.users.findOne({"_id": getTicket.userId}) || {};
    if(user){
      var userProfile = UserProfile.findOne({"userId": getTicket.userId}) || {};
      if(userProfile.dateOfBirth){
        var today = new Date();
        var birthDate = new Date(userProfile.dateOfBirth);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
        {
            age--;
        }
        userProfile.dateOfBirth=age;
      }else{
        userProfile.dateOfBirth='-';
      }
    }
    
  }        
  
  
  return {
    loading,
    getTicket,
    user,
    userProfile,
    ticketId,
    
  };
})(Ticket);
