import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class EpisodesReportItem extends Component {

  render() {
    return (
      <div className="report-list-item col-lg-5 centered">
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
