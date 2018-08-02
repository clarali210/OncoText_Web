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
        <CSVLink filename={this.props.filename} headers={headers} data={checkedReports} target="_self">
          <p><button className="btn btn-lg btn-info mar">{this.props.exportText}</button></p>
        </CSVLink>
      </div>
    );
  }
}

export default withTracker((props) => {

  return({
    organ: props.organ,
    extractions: props.extractions,
    exportKey: props.exportKey,
    exportText: props.exportText,
    reports: props.reports,
    description: props.desc,
    filename: props.filename,
  })
})(ExportButton);
