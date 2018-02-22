import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { CSVLink } from 'react-csv';

var extractions = require('/imports/extractions.json');

class BulkExportButton extends Component {

  componentWillReceiveProps(nextProps){
    if (JSON.stringify(this.props.info) !== JSON.stringify(nextProps.info)){
      Session.set('bulkExportData', {'text': "Loading...", 'reports': []});
    }
  }

  render() {

    var button = [];

    if (this.props.list.length === 0){
      return(
        <div className={"button-section"}>
          <b>No file uploaded.</b>
          <p><button className="btn btn-lg btn-info mar">Export in Bulk</button></p>
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
      headers = headers.concat(["Report_Date_Time", "filename", "batchID", "train", "validated", "Institution", "MRN", "ReportID"])

      const self = this;
      Meteor.call(
        self.props.db+'.fetchReports', self.props.reportKey, self.props.list,
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
            if (self.props.currentText !== "Export in Bulk"){
              Session.set('bulkExportData', {'text': "Export in Bulk", 'reports': exportData});
            }
          }
        }
      );

      return (
        <div className={"button-section"}>
          <br/>
          <CSVLink filename={this.props.filename} headers={headers} data={Session.get('bulkExportData')['reports']} target="_self">
            <p><button className="btn btn-lg btn-info mar">{Session.get('bulkExportData')['text']}</button></p>
          </CSVLink>
        </div>
      );
    }
  }
}

export default withTracker(() => {
  var storedInfo = JSON.parse(localStorage.getItem('bulkExportInfo') || '{"db": "reports", "key": "EMPI"}');
  var sessionInfo = Session.get('bulkExportInfo') || {'filename': "BulkExport.xlsx", 'list': []};

  Session.set('bulkExportInfo', {'db': storedInfo['db'], 'key': storedInfo['key'], 'filename': sessionInfo['filename'], 'list': sessionInfo['list']});
  Session.set('bulkExportData', Session.get('bulkExportData') || {'text': "Loading...", 'reports': []});

  var info = Session.get('bulkExportInfo');
  var data = Session.get('bulkExportData');

  return({
    info: info,
    db: info['db'],
    reportKey: info['key'],
    filename: info['filename'],
    list: info['list'],
    currentText: data['text'],
    exportData: data['reports'],
  })
})(BulkExportButton);
