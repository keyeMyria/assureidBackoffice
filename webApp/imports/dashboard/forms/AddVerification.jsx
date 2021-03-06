import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class AddVerification extends TrackerReact(Component) {
	 componentDidMount() {
	 	// $("#signUpUser").validate();
	 	// renderFunction();
	 	if (!!!$("link[href='/css/dashboard.css']").length > 0) {
      var dashboardCss = document.createElement("link");
      dashboardCss.type = "text/css";
      dashboardCss.rel = "stylesheet";
      dashboardCss.href = "/css/dashboard.css";
      document.head.append(dashboardCss);
    }
  //   $('#descriptionContent').summernote({
  //       height: 190,
  //       maxHeight:190,
  //       minHeight:175,
  //     });
	 }
   componentWillUnmount(){
    $("link[href='/css/dashboard.css']").remove();
  }
		render() {
       return (
      	<section className="content-wrapper">
           <div className="content">
             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
               <div className="box box-primary">
		              <div className="box-header with-border">
		               <h2 className="box-title">ADD VERIFICATION</h2>
		              </div>
		              <div className="box-body ">
										<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
										  <form id="">
											  <div className="signupBody col-lg-12 col-md-8 col-sm-12 col-xs-12">

											    <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 inputContent">
												   	<span className="blocking-span">
												   		  <label className="floating-label">Name</label>
														   	<input type="text" title="Only alphabets are allowed!" className="form-control inputText" ref="" name="" pattern="[a-zA-Z][a-zA-Z ]+" required />
														</span>
											    </div>
											    <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 inputContent">
										   			<span className="blocking-span">
										   			  <label className="floating-label">Price</label>
													    <input type="number"  title="Please enter numbers only!" className="form-control inputText" ref="" name="" required />
													  </span>
											    </div>
											    <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 inputContent">
												   	<span className="blocking-span">
												   		  <label className="floating-label">Duration</label>
														   	<input type="number" title="Please enter numbers only!" className="form-control inputText" ref="firstname" name="firstname" pattern="[a-zA-Z][a-zA-Z ]+" required />
														</span>
											    </div>
											    <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 inputContent">
												   	<span className="blocking-span">
												   		  <label className="floating-label">Forms</label>
														   	<input type="text" title="Only alphabets are allowed!" className="form-control inputText" ref="" name="" pattern="[a-zA-Z][a-zA-Z ]+" required />
														</span>
											    </div>
											    <div className="form-group col-lg-12 col-md-6 col-xs-12 col-sm-12 inputContent">
												   	<span className="blocking-span">
												   		  <label className="floating-label">Description</label>
																{/*<div id="descriptionContent" name="" ref=""></div>*/}	
                                <textarea name="descriptionContent" ref="descriptionContent" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" rows="10"></textarea>                            
													  </span>
											    </div>										   		

												<div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
											    	<input className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn btn-primary pull-right" type="submit" value="ADD VERIFICATION"/>
											   </div>	

											  </div> 
										  </form>
								 	 	</div>	
						 	    </div>
		           </div>
             </div>
		       </div>
       	</section>
	    );

	} 

}