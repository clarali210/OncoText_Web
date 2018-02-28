import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import ReportLimit from './sub-components/ReportLimit.jsx';
import SearchBar from './sub-components/SearchBar.jsx';
import FilterList from './sub-components/FilterList.jsx';
import EpisodesExportButton from './sub-components/EpisodesExportButton.jsx';
import EpisodesReportList from './sub-components/EpisodesReportList.jsx';
import BulkExportButton from './sub-components/BulkExportButton.jsx';
import BulkExport from './sub-components/BulkExport.jsx';

import { Episodes } from '/imports/api/episodes.js';

var extractions = require('/imports/extractions.json');


class EpisodesView extends Component {

  constructor(props) {
    super(props);
    Session.set('episodes-query', "...");
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
          <div className="col-md-6 centered">
            <EpisodesExportButton exportKey="ReportID" exportText="Export Selected" desc="This exports the set of single path reports selected below." filename={this.queryToFilename()+".csv"}/>
            <EpisodesExportButton exportKey="EMPI" exportText="Export All Reports" desc="This exports ALL path reports associated with the patients selected." filename={this.queryToFilename()+"_All.csv"}/>
            <EpisodesReportList name="episodes" reports={this.props.reports}/>
          </div>
          <div className="col-md-4 centered">
            <BulkExportButton/>
            <BulkExport/>
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
  Session.set('searchBar', JSON.parse(localStorage.getItem('searchBar') || '{"op": "", "terms": [""], "string": ""}'));
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
  var searchBar = Session.get('searchBar');
  if (searchBar['op'] === "AND"){
    filterQuery['$and'] = []
    for (var ind in searchBar['terms']){
      var obj = {$or: [{'ReportID': {$regex: searchBar['terms'][ind], '$options' : 'i'}}, {'Report_Text': {$regex: searchBar['terms'][ind], '$options' : 'i'}}]};
      filterQuery['$and'] = filterQuery['$and'].concat(obj);
    }
  } else if (searchBar['op'] === "OR") {
    filterQuery['$or'] = []
    for (var ind in searchBar['terms']){
      var obj = {$or: [{'ReportID': {$regex: searchBar['terms'][ind], '$options' : 'i'}}, {'Report_Text': {$regex: searchBar['terms'][ind], '$options' : 'i'}}]};
      filterQuery['$or'] = filterQuery['$or'].concat(obj);
    }
  } else {
    filterQuery['$or'] = [{'ReportID': {$regex: searchBar['terms'][0], '$options' : 'i'}}, {'Report_Text': {$regex: searchBar['terms'][0], '$options' : 'i'}}];
  }

  // Report limit
  var reportLimit = parseInt(Session.get('reportLimit'));

  const episodesSubscription = Meteor.subscribe('episodes', filterQuery, reportLimit);
  var reports = Episodes.find({}).fetch();

  // Update query number
  if (episodesSubscription.ready()){
    Meteor.call(
      'episodes.serverQuery', filterQuery,
      function(error, result){
        if (error){
          console.log(error);
        }
        if (result != undefined){
          Session.set('episodes-query', result);
         }
      }
    );
  }
  else{
    Session.set('episodes-query', "...");
  }

  return {
    reports: reports,
    query: Session.get('episodes-query'),
    filterQuery: filterQuery,
  };
})(EpisodesView);
