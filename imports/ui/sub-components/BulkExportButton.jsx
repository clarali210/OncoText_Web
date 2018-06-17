import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { CSVLink } from 'react-csv';

class BulkExportButton extends Component {

  componentWillReceiveProps(nextProps){
    if (JSON.stringify(this.props.info) !== JSON.stringify(nextProps.info)){
      Session.set(this.props.organ+'-bulkExportData', {'text': "Loading...", 'reports': []});
    }
  }

  handleAlert(){
    if (this.props.list.length === 0){
      alert("No file uploaded!");
    }
  }

  render() {

    var button = [];

    if (this.props.list.length === 0){
      return(
        <div className="button-section">
          <div className="button-desc"><b>Download multiple reports by a list of key values such as EMPI or ReportID.</b></div>
          <p><button className="btn btn-lg btn-info mar" onClick={() => this.handleAlert()}>Export in Bulk</button></p>
        </div>
      );
    } else {
      var exportData = [];

      if (this.props.db == 'episodes'){
      	 var headers = ["EMPI", "EpisodeID", "Episode_Start_Date", "Episode_Last_Date"];
      } else {
      	var headers = ["EMPI", "EpisodeID", "Report_Date", "Report_Text"];
      }

      for (var category in this.props.extractions){
        for (var label in this.props.extractions[category]){
          headers.push(label);
        }
      }
      headers = headers.concat(["Report_Text_Segmented", "Report_Date_Time", "filename", "batchID", "train", "Institution", "MRN", "ReportID"])

      const self = this;
      Meteor.call(
        self.props.db+'.fetchReports', self.props.organ, self.props.reportKey, self.props.list,
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
              Session.set(self.props.organ+'-bulkExportData', {'text': "Export in Bulk", 'reports': exportData});
            }
          }
        }
      );

      return (
        <div className="button-section">
          <div className="button-desc"><b>Download multiple reports by a list of key values such as EMPI or ReportID.</b></div>
          <CSVLink filename={this.props.filename} headers={headers} data={Session.get(this.props.organ+'-bulkExportData')['reports']} target="_self">
            <p><button className="btn btn-lg btn-info mar">{Session.get(this.props.organ+'-bulkExportData')['text']}</button></p>
          </CSVLink>
        </div>
      );
    }
  }
}

export default withTracker((props) => {
  var storedInfo = JSON.parse(localStorage.getItem(props.organ+'-bulkExportInfo') || '{"db": "reports", "key": "EMPI"}');
  var sessionInfo = Session.get(props.organ+'-bulkExportInfo') || {'filename': "BulkExport.xlsx", 'list': []};

  Session.set(props.organ+'-bulkExportInfo', {'db': storedInfo['db'], 'key': storedInfo['key'], 'filename': sessionInfo['filename'], 'list': sessionInfo['list']});
  Session.set(props.organ+'-bulkExportData', Session.get(props.organ+'-bulkExportData') || {'text': "Loading...", 'reports': []});

  var info = Session.get(props.organ+'-bulkExportInfo');
  var data = Session.get(props.organ+'-bulkExportData');

  return({
    organ: props.organ,
    extractions: props.extractions,
    info: info,
    db: info['db'],
    reportKey: info['key'],
    filename: info['filename'],
    list: info['list'],
    currentText: data['text'],
    exportData: data['reports'],
  })
})(BulkExportButton);
