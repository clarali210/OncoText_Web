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

  handleClick(){
    if (this.props.validatedReports.length > 0){
      this.handleSubmitValidated();
    } else {
      alert("No validated reports to submit!");
    }
  }

  render(){
    return (
      <div className="button-section submit-button">
        <div className="button-desc"><b>This submits the validated reports back to the machine for re-training.</b></div>
        <p><button className="btn btn-lg btn-info mar" onClick={() => this.handleClick()}>Submit Validated</button></p>
      </div>
    );
  }
}

SubmitValidatedButton.propTypes = {
  validatedReports: PropTypes.array.isRequired,
};
