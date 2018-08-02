import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { CheckboxGroup } from 'react-checkbox-group';

import ReportItem from './ReportItem.jsx';

class ReportList extends Component {

  render() {
    var rows = [];
    if (this.props.loading){
      rows.push(<img src="/images/loading.gif" height="150vw" key={"loading-"+this.props.name}/>);
    } else {
      var reports = this.props.reports[this.props.name];
      for (var ind in reports){
        rows.push(<ReportItem organ={this.props.organ} report={reports[ind]} key={reports[ind]._id}/>);
      }
    }

    return (
      <div className="list-container">
        <div className="list-container-title">{this.props.containerTitle}</div>
        <div>
          {rows}
        </div>
      </div>
    );
  }
}

export default withTracker((props) => {

  if (props.name === "unvalidated"){
    var containerTitle = "Remaining";
  } else {
    var containerTitle = "Validated";
  }

  var reports = props.reports[props.name];

  var displayedIDs = [];
  reports.forEach((report) => {
    displayedIDs.push(report['ReportID']);
  })

  return({
    organ: props.organ,
    name: props.name,
    reports: props.reports,
    displayedIDs: displayedIDs,
    containerTitle: containerTitle,
    loading: Session.get(props.organ+'-query') === "...",
  });
})(ReportList);
