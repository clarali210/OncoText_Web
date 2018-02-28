import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { CSVLink } from 'react-csv';

var extractions = require('/imports/extractions.json');

class EpisodesExportButton extends Component {

  componentWillReceiveProps(nextProps){
    if (JSON.stringify(this.props.checkedReports) !== JSON.stringify(nextProps.checkedReports)){
      Session.set('exportText', {'ReportID': "Loading...", 'EMPI': 'Loading...'});
      Session.set('exportData', {'ReportID': [], "EMPI": []});
    }
  }

  handleAlert(){
    if (this.props.checkedReports.length === 0){
      alert("No reports selected!");
    }
  }

  render() {

    var button = [];
    var checkedReports = this.props.checkedReports;

    if (checkedReports.length === 0){
      return(
        <div className={"button-section export-"+this.props.exportKey}>
          <div className="button-desc"><b>{this.props.description}</b></div>
          <p><button className="btn btn-lg btn-info mar" onClick={() => this.handleAlert()}>{this.props.exportText}</button></p>
        </div>
      );
    } else {
      var exportData = [];

      var headers = ["EMPI", "EpisodeID", "Report_Date"];
      for (var category in extractions){
        for (var label in extractions[category]){
          headers.push(label);
        }
      }
      headers = headers.concat(["Report_Date_Time", "filename", "batchID", "train", "Institution", "MRN", "ReportID"])

      const self = this;
      Meteor.call(
        'episodes.exportChecked', self.props.exportKey, checkedReports,
        function(error, result){
          if (error){
            console.log(error);
          }
          if (result != undefined){
            for (var ind in result) {
              var report = result[ind];
              // Prevent Report_Text from being delimited in the csv file/browser
              report['Report_Text'] = report['Report_Text'].replace(/\"/g, "\'");
              report['Report_Text'] = report['Report_Text'].replace(/\#/g, "number");
              // Prevent duplicates
              if (! exportData.find(r => r.ReportID === report.ReportID)){
                exportData.push(report);
              }
            }

            // Update button text
            if (self.props.currentText[self.props.exportKey] !== self.props.exportText){
              var newText = self.props.currentText;
              newText[self.props.exportKey] = self.props.exportText;
              Session.set('exportText', newText);

              var exports = self.props.exportData;
              exports[self.props.exportKey] = exportData;
              Session.set('exportData', exports);
            }
          }
        }
      );

      return (
        <div className={"button-section export-"+this.props.exportKey}>
          <div className="button-desc"><b>{this.props.description}</b></div>
          <CSVLink filename={this.props.filename} headers={headers} data={Session.get('exportData')[this.props.exportKey]} target="_self">
            <p><button className="btn btn-lg btn-info mar">{Session.get('exportText')[this.props.exportKey]}</button></p>
          </CSVLink>
        </div>
      );
    }
  }
}

export default withTracker((props) => {
  Session.set('exportText', Session.get('exportText') || {'ReportID': "Loading...", 'EMPI': 'Loading...'});
  Session.set('exportData', Session.get('exportData') || {'ReportID': [], "EMPI": []});

  return({
    exportKey: props.exportKey,
    exportText: props.exportText,
    currentText: Session.get('exportText'),
    exportData: Session.get('exportData'),
    checkedReports: Session.get('episodes-checkedReports') || [],
    description: props.desc,
    filename: props.filename,
  })
})(EpisodesExportButton);
