import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import ReportLimit from './sub-components/ReportLimit.jsx';
import SearchBar from './sub-components/SearchBar.jsx';
import FilterList from './sub-components/FilterList.jsx';
import ExportButton from './sub-components/ExportButton.jsx';
import UnvalidateCheckedButton from './sub-components/UnvalidateCheckedButton.jsx';
import SubmitValidatedButton from './sub-components/SubmitValidatedButton.jsx';
import ReportList from './sub-components/ReportList.jsx';

import { Reports } from '/imports/api/reports.js';

var extractions = require('/imports/extractions.json');


class AllReportsView extends Component {

  constructor(props) {
    super(props);
    Session.set('query', "...");
  }

  queryToFilename(){
    var filterQuery = this.props.filterQuery;
    delete filterQuery['$or'];
    filterQuery['Search'] = Session.get('searchBar');

    var filename = JSON.stringify(filterQuery);
    filename = filename.replace(/\"/g, "").replace(/\:/g, "=").replace(/\,/g, "\_")
    return (filename);
  }

  render(){
    return (
      <div className="row centered">

        <div className="col-md-12 view-bar row row-same-height centered">
          <div className="report-limit">
            <ReportLimit/>
          </div>
          <div className="view-bar-title">
            <h2>Viewing All</h2>
            <div id="num_report"><i>{this.props.query} matching query</i></div>
          </div>
          <div className="search">
            <SearchBar/>
          </div>
        </div>

        <div className="col-md-12 centered">
          <div className="col-md-2 centered">
            <FilterList/>
          </div>
          <div className="col-md-5 centered">
            <ExportButton exportKey="ReportID" exportText="Export Selected" filename={this.queryToFilename()+".csv"}/>
            <ExportButton exportKey="EMPI" exportText="Export EMPI History" filename={this.queryToFilename()+"_EMPIs.csv"}/>
            <ReportList name="unvalidated" reports={this.props.reports}/>
          </div>
          <div className="col-md-5 centered">
            <UnvalidateCheckedButton/>
            <SubmitValidatedButton validatedReports={this.props.reports['validated']}/>
            <ReportList name="validated" reports={this.props.reports}/>
          </div>
        </div>

      </div>
    );
  }
}

export default withTracker(() => {
  // Initialize Session values
  var prevFilters = JSON.parse(localStorage.getItem('filters') || '{}');
  if (Object.keys(prevFilters).length === 0){
    for (var category in extractions){
      for (var filterName in extractions[category]){
        prevFilters[filterName] = null;
      }
    }
  }
  Session.set('filters', prevFilters);
  Session.set('searchBar', localStorage.getItem('searchBar') || "");
  Session.set('reportLimit', localStorage.getItem('reportLimit') || "1");


  //Subscribe only to filtered reports
  var filterQuery = {};

  // Extraction filters
  var filters = Session.get('filters');
  for (var filterName in filters){
    if (filters[filterName] !== null){
      filterQuery[filterName] = filters[filterName];
    }
  }

  // Search bar
  var searchTerm = Session.get('searchBar');
  if (!isNaN(parseFloat(searchTerm)) && isFinite(searchTerm)){
    filterQuery['$or'] = [{$where: "/^"+searchTerm+".*/.test(this.EMPI)"}];
  }
  else{
    filterQuery['$or'] = [{'ReportID': {$regex: searchTerm, '$options' : 'i'}}, {'Report_Text': {$regex: searchTerm, '$options' : 'i'}}];
  }

  // Report limit
  var reportLimit = parseInt(Session.get('reportLimit'));
  console.log(filterQuery);

  const reportSubscription = Meteor.subscribe('reports', filterQuery, reportLimit);
  var unvalidatedReports = Reports.find({$where: "this.validatedLabels.length === 0"}).fetch();
  var validatedReports = Reports.find({$where: "this.validatedLabels.length > 0"}).fetch();

  // Keep track of object ids for "nextReport" button in OneReportView
  var unvalidated_ids = [];
  for (var ind in unvalidatedReports.reverse()){
    unvalidated_ids.push(unvalidatedReports[ind]['_id']._str);
  }
  var validated_ids = [];
  for (var ind in validatedReports.reverse()){
    validated_ids.push(validatedReports[ind]['_id']._str);
  }
  localStorage.setItem('report_ids', JSON.stringify({
    unvalidated: unvalidated_ids,
    validated: validated_ids
  }));

  // Update query number
  if (reportSubscription.ready()){
    Meteor.call(
      'reports.serverQuery', filterQuery,
      function(error, result){
        if (error){
          console.log(error);
        }
        if (result != undefined){
          Session.set('query', result);
          localStorage.setItem('query', result);
        }
      }
    );
  }
  else{
    Session.set('query', "...");
  }

  return {
    reports: {
      unvalidated: unvalidatedReports,
      validated: validatedReports
    },
    query: Session.get('query'),
    filterQuery: filterQuery,
  };
})(AllReportsView);
