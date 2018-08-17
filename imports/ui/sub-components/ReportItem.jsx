import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ReportItem extends Component {

  render() {
    return (
      <div className="report-list-item col-lg-5 centered">
        <a href={"/" + this.props.organ + "/reports/" + this.props.report['_id'].valueOf()} style={{width: "100%"}}>
          {this.props.report['ReportID']}
        </a>
      </div>
    );
  }
}

ReportItem.propTypes = {
  organ: PropTypes.string.isRequired,
  report: PropTypes.object.isRequired,
};
