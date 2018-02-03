import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SubmitValidatedButton extends Component {

  handleSubmitValidated(){
    // Creates a confimation popup in brower window
    new Confirmation({
      message: "Please confirm that you want to submit validated reports. Once you submit validated reports, they will be used to train the automatic annotator.",
      title: "Submit Confirmation",
      cancelText: "Cancel",
      okText: "Submit Validated Reports",
      success: true, // whether the button should be green or red
      focus: "cancel" // which button to autofocus, "cancel" (default) or "ok", or "none"
    }, function (ok) {
      // If user confirms submission, meteor call to submit validated reports
      if (ok) {
        Meteor.call('reports.submitAndRemoveValidated');
      };
    });
  }

  render(){
    if (this.props.validatedReports.length > 0) {
      return (
        <div className="submit-section float-right">
          <br/>
          <p><button className="btn btn-lg btn-info mar" onClick={() => this.handleSubmitValidated()}>Submit Validated</button></p>
        </div>
      );
    } else {
      return (
        <div className="submit-section float-right">
          <b>No validated reports to submit.</b>
          <p><button className="btn btn-lg btn-info mar">Submit Validated</button></p>
        </div>
      );
    }
  }
}

SubmitValidatedButton.propTypes = {
  validatedReports: PropTypes.array.isRequired,
};
