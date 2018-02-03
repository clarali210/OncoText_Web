import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { CheckboxGroup } from 'react-checkbox-group';

import ReportItem from './ReportItem.jsx';

class ReportList extends Component {

  handleCheckAll(){
    var reports = this.props.reports[this.props.name];
    var checkedReports = Session.get('checkedReports');

    if (checkedReports[this.props.name].length === reports.length){
      checkedReports[this.props.name] = [];
    } else {
      checkedReports[this.props.name] = this.props.displayedIDs;
    }

    Session.set('checkedReports', checkedReports)
  }

  handleCheckReports(newReports) {
    var checkedReports = Session.get('checkedReports');
    checkedReports[this.props.name] = newReports;

    Session.set('checkedReports', checkedReports);
  }

  render() {
    var rows = [];
    if (this.props.loading){
      rows.push(<img src="/images/loading.gif" height="150vw" key={"loading-"+this.props.name}/>);
    } else {
      var reports = this.props.reports[this.props.name];
      for (var ind in reports){
        rows.push(<ReportItem report={reports[ind]} key={reports[ind]._id}/>);
      }
    }

    return (
      <div className="list-container">
        <div className="check-all">
          <input id={"check-all-"+this.props.name} type="checkbox" checked={Session.get('checkAll')[this.props.name]}
          onChange={() => this.handleCheckAll()}/>
          <label className="check checkbox-label-all" htmlFor={"check-all-"+this.props.name}> All</label>
        </div>
        <div className="list-container-title">{this.props.containerTitle}</div>
        <div>
          <CheckboxGroup name={this.props.name} value={this.props.checkedReports[this.props.name]}
          onChange={(newReports) => this.handleCheckReports(newReports)}>
            {rows}
          </CheckboxGroup>
        </div>
      </div>
    );
  }
}

export default withTracker((props) => {
  // Initiate session variables
  Session.set('checkedReports', Session.get('checkedReports') || {unvalidated: [], validated: []});
  Session.set('checkAll', {unvalidated: false, validated: false});

  if (props.name === "unvalidated"){
    var containerTitle = "Remaining";
  } else {
    var containerTitle = "Validated";
  }

  var reports = props.reports[props.name];

  // Uncheck reports that are not displayed
  var displayedIDs = [];
  reports.forEach((report) => {
    displayedIDs.push(report['ReportID']);
  })

  var currentChecked = Session.get('checkedReports');
  currentChecked[props.name] = currentChecked[props.name].filter((ID) => displayedIDs.includes(ID));
  Session.set('checkedReports', currentChecked);

  // Set checkAll value
  var checkAll = Session.get('checkAll');
  checkAll[props.name] = true;
  if (displayedIDs.length === 0) {
    checkAll[props.name] = false;
  } else {
    for (var ind in displayedIDs){
      if (!currentChecked[props.name].includes(displayedIDs[ind])){
        checkAll[props.name] = false;
      }
    }
  }
  Session.set('checkAll', checkAll);

  return({
    name: props.name,
    reports: props.reports,
    displayedIDs: displayedIDs,
    containerTitle: containerTitle,
    checkedReports: currentChecked,
    checkAll: checkAll,
    loading: Session.get('query') === "...",
  });
})(ReportList);
