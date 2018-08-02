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

var allExtractions = require("/imports/extractions.json")['All']

class AllReportsView extends Component {

  constructor(props) {
    super(props);
    Session.set(props.organ+'-query', "...");
  }

  queryToFilename(){
    var filename = new Date().toJSON().slice(0,10).replace(/_/g,'-');
    if (Session.get(this.props.organ+'-searchBar')['string'] !== ""){
      filename = filename + "_" + Session.get(this.props.organ+'-searchBar')['string'];
    }

    filename = filename.replace(/\"/g, "")
    return (filename);
  }

  render(){
    return (
      <div className="row centered">

        <div className="col-md-12 view-bar row row-same-height centered">
          <div className="report-limit">
            <ReportLimit organ={this.props.organ}/>
          </div>
          <div className="view-bar-title">
            <h2>Viewing All</h2>
            <div id="num_report"><i>{this.props.query} matching query</i></div>
          </div>
          <div className="search">
            <SearchBar organ={this.props.organ}/>
          </div>
        </div>

        <div className="col-md-12 centered">
          <div className="col-md-2 centered">
            <FilterList organ={this.props.organ} extractions={this.props.extractions}/>
          </div>
          <div className="col-md-5 centered">
            <ExportButton organ={this.props.organ} extractions={allExtractions} reports={this.props.reports}
            exportKey="ReportID" exportText="Export Displayed" desc="This exports the set of single path reports displayed below."
            filename={this.queryToFilename()+".csv"}/>
            <ExportButton organ={this.props.organ} extractions={allExtractions} reports={this.props.reports}
            exportKey="EMPI" exportText="Export All Reports" desc="This exports ALL path reports associated with the patients selected."
            filename={this.queryToFilename()+"_All.csv"}/>
            <ReportList organ={this.props.organ} name="unvalidated" reports={this.props.reports}/>
          </div>
          <div className="col-md-5 centered">
            <UnvalidateDisplayedButton organ={this.props.organ} validatedReports={this.props.reports['validated']}/>
            <SubmitValidatedButton organ={this.props.organ} validatedReports={this.props.reports['validated']}/>
            <ReportList organ={this.props.organ} name="validated" reports={this.props.reports}/>
          </div>
        </div>

      </div>
    );
  }
}

export default withTracker((props) => {

  const db = props.db;
  const organ = props.organ;
  const extractions = props.extractions;

  // Initialize Session values
  var prevFilters = JSON.parse(localStorage.getItem(organ+'-filters') || '{}');
  if (Object.keys(prevFilters).length === 0){
    for (var category in extractions){
      for (var filterName in extractions[category]){
        prevFilters[filterName] = null;
      }
    }
  }
  Session.set(organ+'-filters', prevFilters);
  Session.set(organ+'-searchBar', JSON.parse(localStorage.getItem(organ+'-searchBar') || '{"op": "", "terms": [""], "string": ""}'));
  Session.set(organ+'-reportLimit', localStorage.getItem(organ+'-reportLimit') || "1");


  //Subscribe only to filtered reports
  var filterQuery = {};

  // Extraction filters
  var filters = Session.get(organ+'-filters');
  for (var filterName in filters){
    if (filters[filterName] !== null){
      filterQuery[filterName] = filters[filterName];
    }
  }

  // Search bar
  var generateSearch = function(fields, searchTerm){
    var searches = [];
    for (var ind in fields){
      const key = fields[ind];
      searches.push({[key]: {$regex: searchTerm, '$options' : 'i'}});
    }
    return searches;
  };
  var searchBar = Session.get(organ+'-searchBar');
  if (searchBar['op'] === "AND"){
    filterQuery['$and'] = []
    for (var ind in searchBar['terms']){
      var obj = {$or: generateSearch(["ReportID", "EMPI", "Report_Text"], searchBar['terms'][ind])};
      filterQuery['$and'] = filterQuery['$and'].concat(obj);
    }
  } else if (searchBar['op'] === "OR") {
    filterQuery['$or'] = []
    for (var ind in searchBar['terms']){
      var obj = {$or: generateSearch(["ReportID", "EMPI", "Report_Text"], searchBar['terms'][ind])};
      filterQuery['$or'] = filterQuery['$or'].concat(obj);
    }
  } else {
    filterQuery['$or'] = generateSearch(["ReportID", "EMPI", "Report_Text"], searchBar['terms'][0]);
  }

  // Report limit
  var reportLimit = parseInt(Session.get(organ+'-reportLimit'));

  const reportSubscription = Meteor.subscribe(organ+'-reports', filterQuery, reportLimit);
  var unvalidatedReports = db.find({$where: "this.validatedLabels.length === 0"}).fetch();
  var validatedReports = db.find({$where: "this.validatedLabels.length > 0"}).fetch();

  // Keep track of object ids for "nextReport" button in OneReportView
  var unvalidated_ids = [];
  for (var ind in unvalidatedReports.reverse()){
    unvalidated_ids.push(unvalidatedReports[ind]['_id']._str);
  }
  var validated_ids = [];
  for (var ind in validatedReports.reverse()){
    validated_ids.push(validatedReports[ind]['_id']._str);
  }
  localStorage.setItem(organ+'-report_ids', JSON.stringify({
    unvalidated: unvalidated_ids,
    validated: validated_ids
  }));

  // Update query number
  if (reportSubscription.ready()){
    Meteor.call(
      'reports.serverQuery', organ, filterQuery,
      function(error, result){
        if (error){
          console.log(error);
        }
        if (result != undefined){
          Session.set(organ+'-query', result);
          localStorage.setItem(organ+'-query', result);
        }
      }
    );
  }
  else{
    Session.set(organ+'-query', "...");
  }

  return {
    organ: organ,
    extractions: extractions,
    reports: {
      unvalidated: unvalidatedReports,
      validated: validatedReports
    },
    query: Session.get(organ+'-query'),
    filterQuery: filterQuery,
  };
})(AllReportsView);
