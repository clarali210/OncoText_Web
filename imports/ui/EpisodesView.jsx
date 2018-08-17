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

var allExtractions = require("/imports/extractions.json")['All'];

class EpisodesView extends Component {

  constructor(props) {
    super(props);
    Session.set(props.organ+'-episodes-query', "...");
  }

  queryToFilename(){
    var filterQuery = this.props.filterQuery;
    delete filterQuery['$or'];
    filterQuery['Search'] = Session.get(this.props.organ+'-searchBar')['string'];

    var filename = JSON.stringify(filterQuery);
    filename = filename.replace(/\"/g, "").replace(/\:/g, "=").replace(/\,/g, "\_")
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
          <div className="col-md-6 centered">
            <EpisodesExportButton organ={this.props.organ} extractions={allExtractions} exportKey="ReportID" reports={this.props.reports}
            exportText="Export Displayed" desc="This exports the set of single path reports displayed below."
            filename={this.queryToFilename()+".csv"}/>
            <EpisodesExportButton organ={this.props.organ} extractions={allExtractions} exportKey="EMPI" reports={this.props.reports}
            exportText="Export All Reports" desc="This exports ALL path reports associated with the patients selected."
            filename={this.queryToFilename()+"_All.csv"}/>
            <EpisodesReportList organ={this.props.organ} name="episodes" reports={this.props.reports}/>
          </div>
          <div className="col-md-4 centered">
            <BulkExportButton organ={this.props.organ} extractions={allExtractions}/>
            <BulkExport organ={this.props.organ}/>
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

  const episodesSubscription = Meteor.subscribe(organ+'-episodes', filterQuery, reportLimit);
  var reports = db.find({}).fetch();

  // Update query number
  if (episodesSubscription.ready()){
    Meteor.call(
      'episodes.serverQuery', organ, filterQuery,
      function(error, result){
        if (error){
          console.log(error);
        }
        if (result != undefined){
          Session.set(organ+'-episodes-query', result);
         }
      }
    );
  }
  else{
    Session.set(organ+'-episodes-query', "...");
  }

  return {
    organ: organ,
    extractions: extractions,
    reports: reports,
    query: Session.get(organ+'-episodes-query'),
    filterQuery: filterQuery,
  };
})(EpisodesView);
