import React, { Component } from 'react';
// import {createContainer} from 'meteor/react-meteor-data';
import { withTracker } from 'meteor/react-meteor-data';
import { render } from 'react-dom';
// import {PropTypes} from 'prop-types';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Services} from '/imports/dashboard/reactCMS/api/Services.js';
// import { ParkingSlots } from '../../../addressVerification/api/verificationAddress.js';
// import { UserAddress } from '../../../addressVerification/api/verificationAddress.js';
import {browserHistory} from 'react-router';
class EditUserProfile extends TrackerReact(Component){

	constructor(props) {
	  super(props); 
	  var userId       =  this.props.post._id;
	  if(this.props.post){
		  if(this.props.post.profile){
			  this.state = {
			    firstname     : this.props.post.profile.firstname,
			    lastname      : this.props.post.profile.lastname,
			    username      : this.props.post.username, 
			    mobNumber     : this.props.post.profile.mobNumber,
			    email         : this.props.post.email,
			    userProfile   : this.props.post.profile.userProfile,
			    'servicesName': this.props.post.profile.servicesName,
          'reportToRole': this.props.post.profile.reportToRole,
          'reportToName': this.props.post.profile.reportToName,
			    subscription  : {
									"parkDataSlots" : Meteor.subscribe('parkDataSlots',userId),
									"userAddrData"  : Meteor.subscribe('userAddrData',userId),
									"userParkingSlotsData"  : Meteor.subscribe('userParkingSlotsData'),
									"userAddrData"  : Meteor.subscribe('userAddresses'),
								},
			  };
			}
			if (this.props.post.roles) {
				this.state = {
      	  role : this.props.post.roles[1],
      	};
      }
	  }else{
		  this.state = {
		    data          : '',
		    firstname     : '',
		    lastname      : '',
		    username      : '',
		    mobNumber     : '',
		    email         : '',
		    userProfile   : '',
		    servicesName  : [],
        reportToRole  : '',
        reportToName  : '',
        role          : '',
		  };	  	
	  }
	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	}

  componentWillReceiveProps(nextProps) {
  	if(!nextProps.loading){	
    	if(nextProps.post){	
	    	if(nextProps.post.profile){	
	    		console.log("this.props.post.profile",nextProps.post.profile);

	            this.setState({
	                firstname  : nextProps.post.profile.firstname,
	                lastname   : nextProps.post.profile.lastname,
	                userProfile: nextProps.post.profile.userProfile,
	                username   : nextProps.post.username,
	                mobNumber  : nextProps.post.profile.mobNumber,
	                email      : nextProps.post.emails[0].address,
	                servicesName : nextProps.post.profile.servicesName,
                  reportToRole : nextProps.post.profile.reportToRole,
                  reportToName: nextProps.post.profile.reportToName,
	            })
	        }
	        if (nextProps.post.roles) {
	        	 this.setState({
	        	  role : nextProps.post.roles[1],
	        	    })
	        }
        }
      }

          this.handleChange = this.handleChange.bind(this);
          this.handleSubmit = this.handleSubmit.bind(this);
  }


	handleSubmit(event) {
	    event.preventDefault();
	    var userId          = this.props.post._id;
	    // console.log("userId",userId);
	    if(userId){
	    	var id            = userId;
	    }else{
	    	var id            = Meteor.userId();
	    }
      var reportrefValue = this.refs.reportToRef.value;      
      if(reportrefValue!=""){
        var splitValue   =  reportrefValue.split("(");
        var reportToRole = splitValue[0];
        var reportToName = splitValue[1].slice(0, -1);
      }else{ 
        var reportToName = '';
        var reportToRole = ''; 
      }
      console.log("reportrefValue :"+reportrefValue);
      

	    var formValues = {
                firstname  : this.refs.editFirstName.value,
                lastname   : this.refs.editLastName.value,
                mobNumber  : this.refs.editContactNum.value,
                servicesName     : this.refs.servicesRef.value,
                reportToRole     : reportToRole,
                reportToName     : reportToName,
	    }
     var assignedrole = this.refs.roleRef.value; 
      // var defaultRoleWith = ["backofficestaff"];
      // defaultRoleWith.push(assignedrole);
        

	    Meteor.call('editMyProfileData',formValues, id,assignedrole, function(error,result){
	    	if(error){
	    		console.log("error"+error);
	    	}else{
	    		 swal('Profile updated Successfully!');
		    		var path = "/admin/UMListOfUsers";
	          browserHistory.replace(path);
	    	}
	    });
	}

	handleChange(event){
	  const target = event.target;
	  const name   = target.name;
	  this.setState({
	  	[name]: event.target.value,
	  });
	}


	componentDidMount(){
    $("html,body").scrollTop(0);
		$('.uneditable').prop('disabled', true);
		if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
     var adminLte = document.createElement("script");  
     adminLte.type="text/javascript";  
     adminLte.src = "/js/adminLte.js";  
     $("body").append(adminLte);  
    }
	}
 componentWillMount() {
    // if (!!!$("link[href='/css/dashboard.css']").length > 0) {
    //   var dashboardCss = document.createElement("link");
    //   dashboardCss.type = "text/css"; 
    //   dashboardCss.rel = "stylesheet";
    //   dashboardCss.href = "/css/dashboard.css"; 
    //   document.head.append(dashboardCss);
    // }
  }
  componentWillUnmount(){  
     $("script[src='/js/adminLte.js']").remove(); 
     // $("link[href='/css/dashboard.css']").remove(); 
  }

  onInput(event){
	  this.setState({firstname: event.target.value})
	}

	uploadProfileImg(event){
	    event.preventDefault();
	    let self = this;
	     this.setState({isUploading: true});
	     //  this.calculateProgress();
	    if (event.currentTarget.files && event.currentTarget.files[0]) {
	        var file = event.currentTarget.files[0];
	         console.log("file",file);
          var userId = this.props.post._id;
          console.log("userId",userId);
	        if (file) {
	            addUserToS3Function(userId,file,self);
	        }
	    }
	}

	uploadProfileClick(event){
		event.preventDefault();
		$('.useruploadImg').click();	
	}


	render() {
		   if(!this.props.loading){	
			   	if(this.props.post){       
				   	if(this.props.post.profile){       
					   	return (
						  	<section className="content-wrapper">
					        <div className="content">
					          <div className="col-lg-12 col-md-10 col-sm-12 col-xs-12 ">
					            <div className="box box-primary">
						            <div className="box-header with-border">
						            	<h4 className="box-title">EDIT PROFILE</h4>
						            </div>
												<div className="box-body">
													<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
														<div className="col-lg-10 col-sm-10 col-xs-10 col-md-10">
															<div className="col-lg-6 col-sm-6 col-xs-6 col-md-6 group inputContent">
																 <span className="floating-label">First Name</span>
																	<span className="blocking-span">	
																		<input type="text" value={this.state.firstname} onChange={this.handleChange} className="inputMaterial form-control inputText" ref="editFirstName" name="firstname"/>
																	</span>
																
															</div>
															<div className="col-lg-6 col-sm-6 col-xs-6 col-md-6 group inputContent">
															  <span className="floating-label">Last Name</span>
																<span className="blocking-span">
																	<input type="text" value={this.state.lastname} onChange={this.handleChange} className="inputMaterial form-control inputText" ref="editLastName" name="lastname" />
																</span>
																							
															</div>
															<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 group inputContent">	
																<div className="disableLabel">Username/Email</div>
																{/*<span className="blocking-span">	*/}									
																	<input type="text" disabled value={this.state.username} onChange={this.handleChange} className="disableInput inputMaterial form-control inputText" ref="editUsername" name="username"/>
																	{/*<span className="floating-label">Username/Email</span>*/}
																{/*</span>*/}
																
															</div>
															
															<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 group inputContent">
															  <span className="floating-label">Mobile Number</span>
																<span className="blocking-span">
																	<input type="text" value={this.state.mobNumber} onChange={this.handleChange} className="inputMaterial form-control inputText" ref="editContactNum" name="mobNumber"/>
																</span>
																								
															</div> 
															<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 inputContent">
												   			<span className="blocking-span">
												   			  <label className="floating-label">Assign Service</label>
				                              <select className="form-control allProductSubCategories" aria-describedby="basic-addon1" name="servicesName" onChange={this.handleChange.bind(this)} ref="servicesRef" value={this.state.servicesName}>

				                                  { this.props.services.length>0 ?
				                                    this.props.services.map( (data, index)=>{
				                                      return (
				                                          <option key={index}>{data.serviceName}</option>
				                                      );
				                                  })
				                                  :
				                                  ""
				                                  }
				                              </select>
														  	</span>
													    </div>
				                      <div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 inputContent">
												   			<span className="blocking-span">
												   			  <label className="floating-label">Assign Role</label>
				                           <select className="form-control allProductSubCategories" aria-describedby="basic-addon1" name="role" onChange={this.handleChange.bind(this)} ref="roleRef" value={this.state.role}>
				                                  { 
				                                   
				                                    this.props.roleList.length > 0 ?
				                                    this.props.roleList.map( (data, index)=>{
				                                      return (
				                                          <option key={index}>{data}</option>
				                                      );
				                                  })
				                                  :
				                                  ""				                              
				                                  }
				                           </select>
															</span>
													    </div>
				                      <div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 inputContent">
												   			<span className="blocking-span">
												   			  <label className="floating-label">Reporting To</label>
				                           
				                              <select className="form-control allProductSubCategories" aria-describedby="basic-addon1" ref="reportToRef">
				                                  { 
				                                    
				                                    this.props.userUniqueData.length>0 ?
				                                    this.props.userUniqueData.map( (data, index)=>{
				                                      return (
				                                          <option key={index}>
				                                            
				                                            {data}
				                                          </option>
				                                      );
				                                    })
				                                    : 
				                                    ""
				                                  

				                                  }
				                              </select>
														  	</span>
													    </div>

															
														</div>

														<div className="col-lg-2 col-sm-2 col-xs-2 col-md-2">
															<img src={this.state.userProfile} className="img-responsive"/>
															<input name="userPic" ref="userPic" onChange={this.uploadProfileImg.bind(this)} className="useruploadImg col-lg-12 col-md-12 col-sm-12 col-xs-12" type="file" />
														<button onClick={this.uploadProfileClick.bind(this)} className="uploaduserPic col-lg-12 col-md-12 btn btn-default">Update Photo</button>
														</div>

											

														<br/>
													</div>
													<br/>
													<div className="col-lg-4 col-sm-12 col-xs-12 col-md-12 pull-right userProfileEditBtn">
														<button onClick={this.handleSubmit.bind(this)} className="btn btn-primary pull-right">Update Profile</button>
													</div>

												</div>	
								</div>
								</div>
							</div>
							</section>
					    );
					}
				}
			}else{
				return (<div className="col-sm-12 col-xs-12 loadingImg"><img src="images/loading.gif" alt="loading"/></div>);
			}


	} 

}

EditUserContainer = withTracker(({params})=>{
    var userId       = params.id;
    if(userId){
    	var id       = userId;
    }else{
    	var id       = Meteor.userId();
    }
    const postHandle = Meteor.subscribe('userData',id);
    var handle       = Meteor.subscribe("services");
	  var rolehandle   = Meteor.subscribe("rolefunction");
	  var userSubscribehandle = Meteor.subscribe('userfunction');
    const post       = Meteor.users.findOne({ '_id': id })||{};
    
    var services     = Services.find({}).fetch(); 
    var allusers     = Meteor.users.find({"roles":{$nin:["user","superAdmin","admin"]}}).fetch();
    // console.log("allusers",allusers);
	  var allRoles     = Meteor.roles.find({}).fetch();         
  	
		  if(allusers.length >0){
		    var newArr = [];
		    // console.log("allusers: ",allusers);
		    for(var i=0;i<allusers.length;i++){
		      
		      var currentText = allusers[i].profile.firstname +" "+ allusers[i].profile.lastname;
		      var reportName  = allusers[i].profile.firstname +" "+ allusers[i].profile.lastname;
		      var userLen = allusers[i].roles;
		      if(userLen.length){
		        for(k=0;k<userLen.length;k++){
		          if(userLen[k]!="backofficestaff"){
		            currentText = userLen[k] +"("+currentText+")" ;
		          }
		        }
		      }
		     
		      newArr.push(currentText);
		  }
		    var roleArray = [];
		    
		  } else{
		    var roleArray = [];
		    newArr = [];
		  }

		 if(allRoles.length >0){
		    for(var j=0;j<allRoles.length;j++){
		      if((allRoles[j].name!="superAdmin") && (allRoles[j].name!= "admin") && (allRoles[j].name!= "user"))  {

		        var rolevalue = allRoles[j].name;
		        roleArray.push(rolevalue);

		      }
		    }
		  }
		    
    var roles =  allRoles;
    var userUniqueData=newArr;
    roleList = roleArray;
    var reporttoName = reportName;

    // console.log("userUniqueData",userUniqueData);
    if(post){
    	 const loading = !postHandle.ready() && !handle.ready()  && !rolehandle.ready() && !userSubscribehandle.ready();
	    return {
	        loading,
	        services, 
	        post,
	        roles,
			    newArr,
			    userUniqueData,
			    roleList,
			    reporttoName
	    };   	
    } 
  
})(EditUserProfile);

export default EditUserContainer;
