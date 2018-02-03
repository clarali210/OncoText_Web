import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import ValidateDisplayedButton from './sub-components/ValidateDisplayedButton.jsx';
import DisplayExtractionsList from './sub-components/DisplayExtractionsList.jsx';
import ReportText from './sub-components/ReportText.jsx';
import Extractions from './sub-components/Extractions.jsx';

import { Reports } from '../api/reports.js';

var extractions = require('/imports/extractions.json');

class OneReportView extends Component {

  constructor(props){
    super(props);
  }

  render(){
    if (this.props.currentReport){
      return (
        <div className="row centered">

          <div className="col-md-12 view-bar row row-same-height">
            <div className="col-md-3"></div>
            <div className="view-bar-title col-md-6">
              <h2>Reviewing Report #<i>{this.props.currentReport['ReportID']}</i></h2>
              <div><i>{this.props.remainingCount} remaining</i></div>
            </div>
            <div className="col-md-1"></div>
            <div className="col-md-1">
              <a href={FlowRouter.path('/')} className="btn btn-lg btn-info back" role="button">Back to Home</a>
            </div>
          </div>
          <div className="col-md-12 row centered">
            <ValidateDisplayedButton currentReport={this.props.currentReport} extractionLabels={this.props.extractionLabels}/>
          </div>
          <div className="col-md-12 row centered content">
            <div className="col-md-2 centered content">
              <DisplayExtractionsList extractionLabels={this.props.extractionLabels}/>
            </div>
            <div className="col-md-6 centered content">
              <div className="list-container">
                <div className="list-container-title">Report Text</div>
                <ReportText currentReport={this.props.currentReport}/>
              </div>
            </div>
            <div className="col-md-4 centered content">
              <div className="list-container">
                <div className="list-container-title">Extractions</div>
                <Extractions currentReport={this.props.currentReport}/>
              </div>
            </div>
          </div>

        </div>
      );
    } else {
      return (<img src="/images/loading.gif" height="250vw" style={{display: "block", margin: "auto"}} key={"loading-one-report-view"}/>);
    }
  }
}

export default withTracker(() => {
  const currentId = FlowRouter.getParam('_id');
  const oid = new Meteor.Collection.ObjectID(currentId);
  Meteor.subscribe('reports', {'_id': oid}, 1);

  var currentReport = Reports.find({}).fetch()[0];

  var extractionLabels = []
  for (var category in extractions){
    extractionLabels = extractionLabels.concat(Object.keys(extractions[category]));
  }

  return{
    currentReport: currentReport,
    remainingCount: localStorage.getItem('query'),
    extractionLabels: extractionLabels
  };
})(OneReportView);
