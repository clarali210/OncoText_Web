import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-checkbox-group';

export default class ReportItem extends Component {

  render() {
    return (
      <div className="report-list-item col-lg-5 centered">
        <Checkbox value={this.props.report['ReportID']} id={this.props.report['ReportID']} />
        <label className="check checkbox-label" htmlFor={this.props.report['ReportID']}></label>
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
