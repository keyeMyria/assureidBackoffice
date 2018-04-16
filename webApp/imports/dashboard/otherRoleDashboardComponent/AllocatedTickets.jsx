import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import {Link} from 'react-router';
import { TicketMaster } from '/imports/website/ServiceProcess/api/TicketMaster.js';

class AllocatedTickets extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
        } 
    } 
    render(){
        return(    
            <div className="col-lg-12 col-md-3 col-sm-3 col-xs-3 noLRPad">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerblock tableinnetWrap noLRPad">
                <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ticketTableLabel">Allocated Tickets
                    <span>
                        <Link to="/admin/opentickets" title="View All">
                            <i className="fa fa-arrow-right pull-right arrowcolor" aria-hidden="true"></i>
                        </Link>
                    </span>
                </label>                        
                    <table className="table">
                        <thead>
                            <tr className="tableHead">
                                <th>Ticket No.</th>
                                <th>Service Name</th>
                                <th>Arrival Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!this.props.loading ?
                                this.props.allocatedTicketList.map((data, index)=>{
                                    return(
                                        <tr key={index}>                  
                                            <td><Link to={"/admin/ticket/"+data._id}>{data.ticketNumber}</Link></td>
                                            <td>{data.serviceName}</td>
                                            <td>{moment(data.createdAt).format('l')}</td>
                                            <td><lable className="bg-green tdStatus"> {data.status} </lable> </td>       
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
        )
    }
}
export default AllocatedTicketsContainer = withTracker(props => { 
    var handleAllocatedTicketList = Meteor.subscribe("listTickets");
    var _id  = Meteor.userId();
    const userHandle  = Meteor.subscribe('userData',_id);
    const user        = Meteor.users.findOne({"_id" : _id});
    const loading    = !userHandle.ready() && !handleAllocatedTicketList.ready();

    if(user){
        var roleArr = user.roles;
        if(roleArr){
        var role = roleArr.find(function (obj) { return obj != 'backofficestaff' });
        }
        //Get all the Tickets Assigned to Me
        var allocatedTicketList = TicketMaster.find({ticketElement: { $elemMatch: { allocatedToUserid: _id }}},{ limit : 5}).fetch();
        console.log("allocatedTicketList");
        console.log(allocatedTicketList);
        if(allocatedTicketList){
        //find last status of the Tickets
        for(i=0;i< allocatedTicketList.length; i++){
            var ticketElements = allocatedTicketList[i].ticketElement;
            switch(role){
                case 'screening committee' : 
                    switch (ticketElements[ticketElements.length - 1].roleStatus) {
                    case 'NewScrAllocated':
                        allocatedTicketList[i].status = 'New' ;  
                        allocatedTicketList[i].bgClassName = 'btn-warning';    
                        break;
                    case 'ScreenApproved' :
                        allocatedTicketList[i].status = 'Approved' ; 
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    case 'ScreenRejected' :
                        allocatedTicketList[i].status = 'Rejected' ;
                        allocatedTicketList[i].bgClassName = 'btn-danger';
                        break;
                    case 'ReviewPass' :
                        allocatedTicketList[i].status = 'Completed' ;
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    default:
                        allocatedTicketList[i].status = 'In Process' ;
                        allocatedTicketList[i].bgClassName = 'btn-primary';
                        break;
                    }
                    break;
                case 'team leader' :
                    switch (ticketElements[ticketElements.length - 1].roleStatus) {
                    case 'screenTLAllocated':
                        allocatedTicketList[i].status = 'New' ;      
                        allocatedTicketList[i].bgClassName = 'btn-warning';
                        break;
                    case 'AssignAccept' :
                        allocatedTicketList[i].status = 'Allocated' ; 
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    case 'AssignReject' :
                        allocatedTicketList[i].status = 'Rejected' ;
                        allocatedTicketList[i].bgClassName = 'btn-danger';
                        break;
                    case 'ReviewPass' :
                        allocatedTicketList[i].status = 'Completed' ;
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    default:
                        allocatedTicketList[i].status = 'In Process' ;
                        allocatedTicketList[i].bgClassName = 'btn-primary';
                        break;
                    }
                    break;
                case 'team member' :
                    switch (ticketElements[ticketElements.length - 1].roleStatus) {
                    case 'Assign':
                        allocatedTicketList[i].status = 'New' ;      
                        allocatedTicketList[i].bgClassName = 'btn-warning';
                        break;
                    case 'QAFail':
                        allocatedTicketList[i].status = 'New' ;      
                        allocatedTicketList[i].bgClassName = 'btn-warning';
                        break;
                    case 'AssignAccept' :
                        allocatedTicketList[i].status = 'Accepted' ; 
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    case 'AssignReject' :
                        allocatedTicketList[i].status = 'Rejected' ;
                        allocatedTicketList[i].bgClassName = 'btn-danger';
                        break;
                    case 'ReviewPass' :
                        allocatedTicketList[i].status = 'Completed' ;
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    default:
                        allocatedTicketList[i].status = 'In Process' ;
                        allocatedTicketList[i].bgClassName = 'btn-primary';
                        break;
                    }
                    break;
                case 'quality team member' : 
                    switch (ticketElements[ticketElements.length - 1].roleStatus) {
                        case 'VerificationPassQTMAllocated':
                            allocatedTicketList[i].status = 'New' ;      
                            allocatedTicketList[i].bgClassName = 'btn-warning';
                            break;
                        case 'ReviewFail':
                            allocatedTicketList[i].status = 'New' ;      
                            allocatedTicketList[i].bgClassName = 'btn-warning';
                            break;
                        case 'QAPass' :
                            allocatedTicketList[i].status = 'Approved' ; 
                            allocatedTicketList[i].bgClassName = 'btn-success';
                            break;
                        case 'QAFail' :
                            allocatedTicketList[i].status = 'Rejected' ;
                            allocatedTicketList[i].bgClassName = 'btn-danger';
                            break;
                        case 'ReviewPass' :
                            allocatedTicketList[i].status = 'Completed' ;
                            allocatedTicketList[i].bgClassName = 'btn-success';
                            break;
                        default:
                            allocatedTicketList[i].status = 'In Process' ;
                            allocatedTicketList[i].bgClassName = 'btn-primary';
                            break;
                    }
                    break;
                case 'quality team leader' :
                    switch (ticketElements[ticketElements.length - 1].roleStatus) {
                    case 'QAPassQTLAllocated':
                        assignedTicketList[i].status = 'New' ;      
                        assignedTicketList[i].bgClassName = 'btn-warning';
                        break;
                    case 'ReviewPass' :
                        assignedTicketList[i].status = 'Approved' ; 
                        assignedTicketList[i].bgClassName = 'btn-success';
                        break;
                    case 'ReiewFail' :
                        assignedTicketList[i].status = 'Rejected' ;
                        assignedTicketList[i].bgClassName = 'btn-danger';
                        break;
                    case 'ReviewPass' :
                        assignedTicketList[i].status = 'Completed' ;
                        assignedTicketList[i].bgClassName = 'btn-success';
                        break;
                    default:
                        assignedTicketList[i].status = 'In Process' ;
                        assignedTicketList[i].bgClassName = 'btn-primary';
                        break;
                    }
                    break;
                default : 
                    assignedTicketList[i].status = 'In Process' ;
                    assignedTicketList[i].bgClassName = 'btn-primary';
                    break;
            }
            // allocatedTicketList[i].status = ticketElements[ticketElements.length - 1].roleStatus ;
        } 
        }
    }
    return {
        loading,
        allocatedTicketList
    };
})(AllocatedTickets);

