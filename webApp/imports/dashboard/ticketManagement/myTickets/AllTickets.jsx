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
import { TicketBucket } from '/imports/website/ServiceProcess/api/TicketMaster.js';



class AllTickets extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state = {
      'userDetails': {},
      "userRoleIn": Meteor.userId(),
    }

    
  }
   render(){
    
      var ticketBucketDataa = [1, 2, 3, 4]
      return(            
        <div>
          <div className="content-wrapper">
            <section className="content">
              <div className="row">
                <div className="col-md-12">
                  <div className="box">
                    <div className="box-header with-border">
                      <h2 className="box-title"> All Ticket</h2> 
                    </div>
                        <div className="box-body">
                            <div className="ticketWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            {/* {this.props.ticketBucketData[0].orderId} */}
                                <div>
                                <div className="reports-table-main">
                                    <table id="subscriber-list-outerTable" className="newOrderwrap subscriber-list-outerTable table table-bordered table-hover table-striped table-striped table-responsive table-condensed table-bordered">
                                    <thead className="table-head umtblhdr">
                                      <tr className="hrTableHeader info UML-TableTr">
                                        <th className=""> Ticket No.</th>
                                        <th className=""> Order ID </th>
                                        <th className=""> Service Name </th>
                                        <th className=""> Arrival Date </th>
                                        <th className=""> TAT(Date) </th>
                                        <th className=""> Status </th>
                                      
                                      </tr>
                                  </thead>
                                     
                                        <tbody>
                                        
                                        {
                                          !this.props.loading ?
                                            this.props.ticketBucketData.map((data, index)=>{
                                              return(
                                                  <tr key={index}>
                                                      
                                                      <td><Link to={"/admin/ticket/"+data.ticketid}>{data.ticketNumber}</Link></td>
                                                      <td>{data.orderId}</td>
                                                      <td>{data.serviceName}</td>
                                                      <td>{moment(data.createdAt).format('l')}</td>
                                                      <td>data.tat</td> 
                                                      <td>{data.status}</td>
                                                      
                                                  </tr>
                                              );
                                            })
                                      
                                          :
                                          <div>
                                              return(<span>loading...</span>);
                                          </div>
                                        }

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            </div>
                            
                        </div>
                       
                       </div>
                       </div> 
                    </div>
                 
            </section>
          </div>
        </div>    
      );
    }
}
export default AllTicketContainer = withTracker(props => {
  
  var handleAllBucketTick = Meteor.subscribe("allTicketBucket");
  var ticketId = props.params.id;
  var loading = !handleAllBucketTick.ready();
  var ticketBucketData = _.uniq(TicketBucket.find({}, {sort: {ticketid: 1}}).fetch().map(function(x) { return x;}), true);
  console.log('ticketBucketData Count ');
  console.log("ticketBucketData: ",ticketBucketData);    
  return {
    loading,
    ticketBucketData,
  };
})(AllTickets);