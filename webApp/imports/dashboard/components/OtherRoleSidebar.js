import React,{Component} from 'react';
import {Link} from 'react-router';
import {browserHistory} from 'react-router';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import {TicketBucket} from '/imports/website/ServiceProcess/api/TicketMaster.js';

class OtherRoleSidebar extends TrackerReact(Component){
  constructor() {
   super();
    this.state = {
      subscription :{
        "userData" : Meteor.subscribe("userData",Meteor.userId()), 
      }
    }
  }

  removePersistantSessions(){
      UserSession.delete("progressbarSession", Meteor.userId());
      UserSession.delete("allProgressbarSession", Meteor.userId());
  }

  currentUser(){
    // Meteor.subscribe('userData',Meteor.userId());
    var userData = {"userName" : '', "userProfile" : ''};
    var id = Meteor.userId();
    var getUser = Meteor.users.findOne({"_id" : id});
    if (getUser) {
      if (getUser.roles[0] == "admin") {
        // var userName    = getUser.username;
        if (getUser.profile.firstname == '' && getUser.profile.lastname == '') {
          var userName = "Admin";
        }else if (getUser.profile.firstname != '' && getUser.profile.lastname == '') {
          var userName = getUser.profile.firstname;
        }else if (getUser.profile.firstname == '' && getUser.profile.lastname != '') {
          var userName = getUser.profile.lastname;
        }else{
           var userName = getUser.profile.firstname+' '+getUser.profile.lastname;
        }
        if (getUser.profile.userProfile == '') {
           var userProfile  = "/images/userIcon.png";
        }else{
          var userProfile  = getUser.profile.userProfile;
        }
        userData = {"userName" : userName, "userProfile" : userProfile};
      }else if((getUser.roles[0] != "admin") && (getUser.roles[0] != "user") ){
        if (getUser.profile.firstname == '' && getUser.profile.lastname == '') {
          var userName = "User";
        }else if (getUser.profile.firstname != '' && getUser.profile.lastname == '') {
          var userName = getUser.profile.firstname;
          var role = getUser.roles[1];
          
        }else if (getUser.profile.firstname == '' && getUser.profile.lastname != '') {
          var userName = getUser.profile.lastname;
          var role = getUser.roles[1];
          
        }else{
           var userName = getUser.profile.firstname+' '+getUser.profile.lastname;
           var role = getUser.roles[1];
        }
        if (getUser.profile.userProfile == '') {
           var userProfile  = "/images/userIcon.png";
        }else{
          var userProfile  = getUser.profile.userProfile;
          var role = getUser.roles[1];
          
        }
        userData = {"userName" : userName, "userProfile" : userProfile,"role":role};
      }
    }
    return userData;

  }
 
  render(){
    return(

        <aside className="main-sidebar">
          {/* sidebar: style can be found in sidebar.less */}
          <section className="sidebar">
            {/* Sidebar user panel */}
            <div className="user-panel">
             {!this.props.loading1 ?
              <div className="pull-left image">
               { this.props.user.profile.userProfile ?
                   <img src={this.props.user.profile.userProfile} className="img-circle" alt="User Image" />
                  :
                  <img src="/images/userIcon.png" className="img-circle" alt="User Image" />
               }              
              </div>
              :
              ""
            }
            {!this.props.loading1 ?
                this.props.user.profile ? 
                <div className="pull-left info">
                  <p> {this.props.user.profile.firstname} {this.props.user.profile.lastname}</p>
                  <Link to="javascript:void(0)"><i className="fa fa-circle text-success" />{this.props.role}</Link>
                </div>
                :
                ""
              :
              ""
              }
            </div>
            <ul className="sidebar-menu otherRoleSidebarMenu" data-widget="tree">
              <li className="header">MAIN NAVIGATION</li>
              <li className="">
                <Link to="/admin/dashboard" activeClassName="active">
                  <i className="fa fa-dashboard" />
                    <span>Dashboard</span>
                </Link>
              </li>
              <li className="">
                <Link to="/admin/alltickets" activeClassName="active">
                  <i className="fa fa-ticket" />
                    <span>All Tickets({this.props.alltickets})</span>
                </Link>
              </li>
              <li className="">
                <Link to="/admin/assignedtickets" activeClassName="active">
                <i className="fa fa-ticket" />
                    <span>Ticket Assigned To Me({this.props.assignedTicketCount})</span>
                </Link>
              </li>
              <li className="">
                <Link to="/admin/opentickets" activeClassName="active">
                <i className="fa fa-ticket" />
                    <span>My Open Tickets({this.props.openTicketCount})</span>
                </Link>
              </li>
            
              <li className="">
                <Link to="/admin/approvedtickets" activeClassName="active">
                <i className="fa fa-ticket" />
                    <span>My Approved Tickets({this.props.approvedTicketCount})</span>
                </Link>
              </li>
              <li className="">
                <Link to="/admin/rejectedtickets" activeClassName="active">
                <i className="fa fa-ticket" />
                    <span>My Rejected Tickets({this.props.rejectTicketCount})</span>
                </Link>
              </li>
              <li className="">
                <Link to="/admin/escalatedtickets" activeClassName="active">
                <i className="fa fa-ticket" />
                    <span>My Escalated Tickets({this.props.esclationTicketCount})</span>
                </Link>
              </li>
            </ul>
          </section>
          {/* /.sidebar */}
        </aside>
    );
  }
}
export default allOtherRoleSidebarContainer = withTracker(props => {
  
  var handleAllBucketTick = Meteor.subscribe("allTicketBucket");
  var ticketArr = [];
  var dataDetails = [];
  var loading = !handleAllBucketTick.ready();
  var _id  = Meteor.userId();
  const userHandle  = Meteor.subscribe('userData',_id);
  const user        = Meteor.users.findOne({"_id" : _id});
  const loading1    = !userHandle.ready();
  // console.log("user",user);
  // console.log("userProfile",user.profile.userProfile);
  if (user) {
    if (user.roles) {
      var role = user.roles[1];
    }else{
      var role = "";
    }
  }
  // var ticketBucketData = _.uniq(TicketBucket.find({}, {sort: {ticketNumber: 1}}).fetch().map(function(x) { return x;}), true);
  var ticketBucketData = TicketBucket.find({}).fetch();
  if(ticketBucketData){
    for(var i=0;i<ticketBucketData.length;i++){
        ticketArr.push({ 'ticketId' : ticketBucketData[i].ticketid});
    }
    var pluckId = _.pluck(ticketArr,"ticketId");
    var uniqueId = _.uniq(pluckId);
    var alltickets = uniqueId.length;
  }
  
  var role = '';
  var users = Meteor.users.find({});
  for(j=0;j<users.length;j++){
    for(i=0;i<users[j].roles.length;i++){
    if(users.roles[i] != 'backofficestaff'){
      var role = Meteor.user().roles[i];
      break;
    }
  }
  }
  
  if(role == 'screening committee'){
    var Assigned  = 'New'; 
    var Open      = 'New'; //Need to be changed to "NewScrAllocated"
    var Approved  = 'ScreenApproved';
    var Rejected  = 'ScreenRejected';
    var Escalated = '';
  }else if(role == 'team leader'){
    var Assigned  = 'screenTLAllocated';
    var Open      = 'screenTLAllocated';
    var Approved  = 'AssignAccept';
    var Rejected  = 'AssignReject';
    var Escalated = '';
  }else if(role == 'team member'){
    var Assigned  = 'Assign';
    var Open      = 'Assign';
    var Approved  = 'AssignAccept';
    var Rejected  = 'AssignReject';
    var Escalated = '';
  }else if(role == 'quality team member'){
    var Assigned = '';
    var Open = '';
    var Approved = '';
    var Rejected = '';
    var Escalated = '';
  }else if(role == 'quality team leader'){
    var Assigned = '';
    var Open = '';
    var Approved = '';
    var Rejected = '';
    var Escalated = '';
  }
  

  var ticketBucketData     = TicketBucket.find({"userId":Meteor.userId()}).fetch();   
  var assignedTicketCount  = TicketBucket.find({"userId":Meteor.userId(),'status': Assigned}).count();   
  var openTicketCount      = TicketBucket.find({"userId":Meteor.userId(),'status': Open}).count();
  var approvedTicketCount  = TicketBucket.find({"userId":Meteor.userId(),'status': Approved}).count();
  var rejectTicketCount    = TicketBucket.find({"userId":Meteor.userId(),'status': Rejected}).count();
  var esclationTicketCount = TicketBucket.find({"userId":Meteor.userId(),'status': Escalated}).count();

  
    return {
      loading,
      loading1,
      ticketBucketData,
      alltickets,
      assignedTicketCount,
      openTicketCount,
      approvedTicketCount,
      rejectTicketCount,
      esclationTicketCount,
      user,
      role,
    };
  
  
})(OtherRoleSidebar);
