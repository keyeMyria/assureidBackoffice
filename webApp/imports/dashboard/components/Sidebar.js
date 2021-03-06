import React,{Component} from 'react';
import {Link} from 'react-router';
import {browserHistory} from 'react-router';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

class Sidebar extends TrackerReact(Component){
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

  // currentUser(){
  //   // Meteor.subscribe('userData',Meteor.userId());
  //   var userData = {"userName" : '', "userProfile" : ''};
  //   var id = Meteor.userId();
  //   var getUser = Meteor.users.findOne({"_id" : id});
  //   if (getUser) {
  //     if (getUser.roles[0] == "admin") {
  //       // var userName    = getUser.username;
  //       if (getUser.profile.firstname == '' && getUser.profile.lastname == '') {
  //         var userName = "Admin";
  //       }else if (getUser.profile.firstname != '' && getUser.profile.lastname == '') {
  //         var userName = getUser.profile.firstname;
  //       }else if (getUser.profile.firstname == '' && getUser.profile.lastname != '') {
  //         var userName = getUser.profile.lastname;
  //       }else{
  //          var userName = getUser.profile.firstname+' '+getUser.profile.lastname;
  //       }
  //       if (getUser.profile.userProfile == '') {
  //          var userProfile  = "/images/userIcon.png";
  //       }else{
  //         var userProfile  = getUser.profile.userProfile;
  //       }
  //       userData = {"userName" : userName, "userProfile" : userProfile};
  //     }else{
  //       if (getUser.profile.firstname == '' && getUser.profile.lastname == '') {
  //         var userName = "User";
  //       }else if (getUser.profile.firstname != '' && getUser.profile.lastname == '') {
  //         var userName = getUser.profile.firstname;
  //       }else if (getUser.profile.firstname == '' && getUser.profile.lastname != '') {
  //         var userName = getUser.profile.lastname;
  //       }else{
  //          var userName = getUser.profile.firstname+' '+getUser.profile.lastname;
  //       }
  //       if (getUser.profile.userProfile == '') {
  //          var userProfile  = "/images/userIcon.png";
  //       }else{
  //         var userProfile  = getUser.profile.userProfile;
  //       }
  //       userData = {"userName" : userName, "userProfile" : userProfile};
  //     }
  //   }
  //   return userData;

  // }
  // componentDidMount(){
  //    if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
  //    var adminLte = document.createElement("script");  
  //    adminLte.type="text/javascript";  
  //    adminLte.src = "/js/adminLte.js";  
  //    $("body").append(adminLte);  
  //   }
  // }
  //  componentWillUnmount() {
  //    $("script[src='/js/adminLte.js']").remove(); 
   
  // }

  render(){
    return(

        <aside className="main-sidebar" onClick={this.removePersistantSessions.bind(this)}>
          {/* sidebar: style can be found in sidebar.less */}
          <section className="sidebar">
            {/* Sidebar user panel */}
            <div className="user-panel">
              {!this.props.loading1 ?
              <div className="pull-left image">
               { Meteor.user() ?
                  Meteor.user().profile.userProfile == "" ?
                      <img src="/images/userIcon.png" className="img-circle" alt="User Image" />
                    :
                    <img src={Meteor.user().profile.userProfile} className="img-circle" alt="User Image" />
                  :
                 <img src="/images/userIcon.png" className="img-circle" alt="User Image" />
               }              
              </div>
              :
              ""
            }
            {!this.props.loading1 ?
                this.props.user ? 
                <div className="pull-left info">
                  <p> {this.props.user.profile.firstname} {this.props.user.profile.lastname}</p>
                  <Link to="javascript:void(0)"><i className="fa fa-circle text-success" />Online</Link>
                </div>
                :
                ""
              :
              ""
              }
            </div>
            {/* search form
            <form action="javascript:void(0)" method="get" className="sidebar-form">
              <div className="input-group">
                <input type="text" name="q"className="form-control" placeholder="Search..." />
                <span className="input-group-btn">
                  <button type="submit" name="search" id="search-btn" className="btn btn-flat">
                    <i className="fa fa-search" />
                  </button>
                </span>
              </div>
            </form>
             /.search form */}
            {/* sidebar menu: : style can be found in sidebar.less */}
            <ul className="sidebar-menu" data-widget="tree">
              <li className="header">MAIN NAVIGATION</li>
              <li className="">
                <Link to="/admin/dashboard" activeClassName="active">
                  <i className="fa fa-dashboard" />
                    <span>Dashboard</span>
                </Link>
              </li>
              <li className="treeview">
                <Link to="JavaScript:void(0);">
                  <i className="fa fa-user" />
                  <span>Master Data</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </Link>
                <ul className="treeview-menu">
                  <li>
                    <Link to="/admin/ManageLocation">
                      <i className="fa fa-circle-o" /> Manage Locations
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/University">
                      <i className="fa fa-circle-o" /> Manage University
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/College">
                      <i className="fa fa-circle-o" /> Manage College
                    </Link>
                  </li> 
                  <li>
                    <Link to="/admin/Qualification">
                      <i className="fa fa-circle-o" /> Manage Qualifications
                    </Link>
                  </li>
                  
                  <li>
                    <Link to="/admin/PoliceStation">
                      <i className="fa fa-circle-o" /> Manage Police Station
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/Checklist">
                      <i className="fa fa-circle-o" /> Check List For Verification
                    </Link>
                  </li>        
                  <li>
                    <Link to="/admin/CodeAndReason">
                      <i className="fa fa-circle-o" /> Code And Reason
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/HolidayList">
                      <i className="fa fa-circle-o" /> Holidays List
                    </Link>
                  </li>
                  
                </ul>
              </li>
              {/* <li className="treeview">
                <Link to="javascript:void(0)">
                  <i className="fa fa-files-o" />
                  <span>Blog Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </Link>
                <ul className="treeview-menu">
                  <li>
                    <Link to="/admin/manageblogpage">
                      <i className="fa fa-circle-o" /> Add New Blogs
                      </Link>
                  </li>
                  <li>
                    <Link to="/admin/ListOfBlogs">
                      <i className="fa fa-circle-o" /> List Blogs
                    </Link>
                  </li>
                </ul>
              </li> */}
              {/* <li className="treeview">
                <Link to="javascript:void(0)">
                  <i className="fa fa-newspaper-o" />
                  <span>News Feed Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </Link>
                <ul className="treeview-menu">
                  <li>
                    <Link to="/admin/NewsFeed">
                      <i className="fa fa-circle-o" /> Add News Feeds
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/ListOfNewsFeed">
                      <i className="fa fa-circle-o" /> List News Feeds
                    </Link>
                  </li>
          
                </ul>
              </li> */}
              <li className="treeview">
                <Link to="javascript:void(0)">
                  <i className="fa fa-bell" />
                  <span> Notifications</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </Link>
                <ul className="treeview-menu">
                  <li>
                    <Link to="/admin/CreateTemplate">
                      <i className="fa fa-circle-o" /> Create New Template
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/ViewTemplates">
                      <i className="fa fa-circle-o" /> View All Templates
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="treeview">
                <Link to="javascript:void(0)">
                  <i className="fa fa-briefcase" />
                  <span> Service Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </Link>
                <ul className="treeview-menu">
                  <li>
                    <Link to="/admin/manageservice">
                      <i className="fa fa-circle-o" /> Add New Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/ListOfServices">
                      <i className="fa fa-circle-o" /> List of Services
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="treeview">
                <Link to="javascript:void(0)">
                  <i className="fa fa-archive" />
                  <span> Case Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </Link>
                <ul className="treeview-menu">
                  {/* <li>
                    <Link to="/admin/mytickets">
                      <i className="fa fa-circle-o" /> My Ticket
                    </Link>
                  </li> */}
                  <li>
                    <Link to="/admin/maxnoofticketallocate">
                      <i className="fa fa-circle-o" /> Allocate Max No. of Cases
                    </Link> 
                  </li>
                  <li>
                    <Link to="/admin/ticketdistribution">
                      <i className="fa fa-circle-o" /> SC Case Distribution
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/adminticketdetails">
                      <i className="fa fa-circle-o" /> All Tickets Details 
                    </Link>
                  </li>
                  
                  {/* <li>
                    <Link to="/ComingSoon">
                      <i className="fa fa-circle-o" /> List Packages
                    </Link>
                  </li> */}
                </ul>
              </li>
              <li className="treeview">
                <Link to="javascript:void(0)">
                  <i className="fa fa-archive" />
                  <span> Package Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right"/>
                  </span>
                </Link>
                <ul className="treeview-menu">
                  <li>
                    <Link to="/admin/manageservicepackage">
                      <i className="fa fa-circle-o" /> Add New Package
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/listOfPackages">
                      <i className="fa fa-circle-o" /> List of Packages
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/admin/reports">
                  <i className="fa fa-file-text" />
                    <span>Reporting System</span>
                </Link>
              </li>
            
              <li className="treeview">
                <Link to="javascript:void(0)">
                  <i className="fa fa-users" />
                  <span>User Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </Link>
                <ul className="treeview-menu">
                  <li>
                    <Link to="/admin/createUser">
                      <i className="fa fa-circle-o" /> Add New User
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/UMRolesList">
                      <i className="fa fa-circle-o" /> Add Role
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/UMListOfUsers">
                      <i className="fa fa-circle-o" /> List Of Users
                    </Link>
                  </li>
                  
                </ul>
              </li>
              {/*// <li>
              //   <Link to="/admin/Checklist">
              //     <i className="fa fa-check-square" />
              //       <span>Check List For Field Expert</span>
              //   </Link>
              // </li>*/}
             
            </ul>
          </section>
          {/* /.sidebar */}
        </aside>
    );
  }
}
sidebarContainer = withTracker(props => { 
    var _id  = Meteor.userId();

    const userHandle  = Meteor.subscribe('userData',_id);
    const user        = Meteor.users.findOne({"_id" : _id}) ;
    const loading     = !userHandle.ready();
      return {
          loading  : loading,
          user     : user,
      };
})(Sidebar);
export default sidebarContainer;
