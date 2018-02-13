import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-checkbox-group';

export default class EpisodesReportItem extends Component {

  render() {
    return (
      <div className="report-list-item col-lg-2 centered">
        <Checkbox value={this.props.report['ReportID']} id={this.props.report['ReportID']} />
        <label className="check checkbox-label" htmlFor={this.props.report['ReportID']}></label>
	<div style={{width: "100%"}}>
	  {this.props.report['ReportID']}
	</div>
      </div>
    );
  }
}

EpisodesReportItem.propTypes = {
  report: PropTypes.object.isRequired,
};
