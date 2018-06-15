import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { CheckboxGroup } from 'react-checkbox-group';

import EpisodesReportItem from './EpisodesReportItem.jsx';

class EpisodesReportList extends Component {

  handleCheckAll(){
    var reports = this.props.reports;
    var checkedReports = Session.get(this.props.organ+'-episodes-checkedReports');

    if (checkedReports.length === reports.length){
      checkedReports = [];
    } else {
      checkedReports = this.props.displayedIDs;
    }

    Session.set(this.props.organ+'-episodes-checkedReports', checkedReports)
  }

  handleCheckReports(newReports) {
    var checkedReports = newReports;

    Session.set(this.props.organ+'-episodes-checkedReports', checkedReports);
  }

  render() {
    var rows = [];
    if (this.props.loading){
      rows.push(<img src="/images/loading.gif" height="150vw" key={"loading-"+this.props.name}/>);
    } else {
      var reports = this.props.reports;
      for (var ind in reports){
        rows.push(<EpisodesReportItem report={reports[ind]} key={reports[ind]._id}/>);
      }
    }

    return (
      <div className="list-container">
        <div className="check-all">
          <input id={"check-all-"+this.props.name} type="checkbox" checked={Session.get(this.props.organ+'-checkAll')}
          onChange={() => this.handleCheckAll()}/>
          <label className="check checkbox-label-all" htmlFor={"check-all-"+this.props.name}> All</label>
        </div>
        <div className="list-container-title">{this.props.containerTitle}</div>
        <div>
          <CheckboxGroup name={this.props.name} value={this.props.checkedReports}
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
  Session.set(props.organ+'-episodes-checkedReports', Session.get(props.organ+'-episodes-checkedReports') || []);
  Session.set(props.organ+'-episodes-checkAll', false);

  var reports = props.reports;

  // Uncheck reports that are not displayed
  var displayedIDs = [];
  reports.forEach((report) => {
    displayedIDs.push(report['ReportID']);
  })

  var currentChecked = Session.get(props.organ+'-episodes-checkedReports');
  currentChecked = currentChecked.filter((ID) => displayedIDs.includes(ID));
  Session.set(props.organ+'-episodes-checkedReports', currentChecked);

  // Set checkAll value
  var checkAll = Session.get(props.organ+'-episodes-checkAll');
  checkAll = true;
  if (displayedIDs.length === 0) {
    checkAll = false;
  } else {
    for (var ind in displayedIDs){
      if (!currentChecked.includes(displayedIDs[ind])){
        checkAll = false;
      }
    }
  }
  Session.set(props.organ+'-episodes-checkAll', checkAll);

  return({
    organ: props.organ,
    name: props.name,
    reports: props.reports,
    displayedIDs: displayedIDs,
    containerTitle: "Episodes of Care",
    checkedReports: currentChecked,
    checkAll: checkAll,
    loading: Session.get(props.organ+'-episodes-query') === "...",
  });
})(EpisodesReportList);
