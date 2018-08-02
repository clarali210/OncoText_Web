import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { CSVLink } from 'react-csv';

class ExportButton extends Component {

  componentWillReceiveProps(nextProps){
    if (JSON.stringify(this.props.reports) !== JSON.stringify(nextProps.reports)){
      Session.set(this.props.organ+'-exportText', {'ReportID': "Loading...", 'EMPI': 'Loading...'});
      Session.set(this.props.organ+'-exportData', {'ReportID': [], "EMPI": []});
    }
  }

  render() {
    var checkedReports = this.props.reports['unvalidated'].concat(this.props.reports['validated']);

    if (this.props.exportKey === 'ReportID'){
      checkedReports.forEach((report) => {
        report['Report_Text'] = report['Report_Text'].replace(/\"/g, "\'");
        report['Report_Text'] = report['Report_Text'].replace(/\#/g, "number");
      })

      var newText = this.props.currentText;
      newText[this.props.exportKey] = this.props.exportText;
      Session.set(this.props.organ+'-exportText', newText);

      var exports = this.props.exportData;
      exports[this.props.exportKey] = exportData;
      Session.set(this.props.organ+'-exportData', exports);
    }
    else {
      var displayedIDs = [];
      checkedReports.forEach((report) => {
        displayedIDs.push(report[this.props.exportKey]);
      })

      var exportData = [];

      const self = this;
      Meteor.call(
        'reports.fetchReports', self.props.organ, self.props.exportKey, displayedIDs,
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
              Session.set(self.props.organ+'-exportText', newText);

              var exports = self.props.exportData;
              exports[self.props.exportKey] = exportData;
              Session.set(self.props.organ+'-exportData', exports);

              console.log('ready');
            }
          }
        }
      );
    }

    var headers = ["EMPI", "Report_Date", "Report_Text"];
    for (var category in this.props.extractions){
      for (var label in this.props.extractions[category]){
        headers.push(label);
      }
    }
    headers = headers.concat(["Report_Text_Segmented", "Report_Date_Time", "filename", "batchID", "train", "Institution", "MRN", "ReportID"])

    return (
      <div className={"button-section export-"+this.props.exportKey}>
        <div className="button-desc"><b>{this.props.description}</b></div>
        <CSVLink filename={this.props.filename} headers={headers} data={Session.get(this.props.organ+'-exportData')[this.props.exportKey]} target="_self">
          <p><button className="btn btn-lg btn-info mar">{Session.get(this.props.organ+'-exportText')[this.props.exportKey]}</button></p>
        </CSVLink>
      </div>
    );
  }
}

export default withTracker((props) => {
  Session.set(props.organ+'-exportText', Session.get(props.organ+'-exportText') || {'ReportID': "Loading...", 'EMPI': 'Loading...'});
  Session.set(props.organ+'-exportData', Session.get(props.organ+'-exportData') || {'ReportID': [], "EMPI": []});

  return({
    organ: props.organ,
    extractions: props.extractions,
    exportKey: props.exportKey,
    exportText: props.exportText,
    currentText: Session.get(props.organ+'-exportText'),
    exportData: Session.get(props.organ+'-exportData'),
    reports: props.reports,
    description: props.desc,
    filename: props.filename,
  })
})(ExportButton);
