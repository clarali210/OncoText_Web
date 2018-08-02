import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class UnvalidateDisplayedButton extends Component {

  handleUnvalidate(){
    this.props.reports.forEach((report) => {
      Meteor.call('reports.updateReport', organ, report['_id'], {validatedLabels: []});
    })
  }

  handleClick(){
    if (this.props.reports !== null && this.props.reports.length !== 0){
      this.handleUnvalidate();
    } else {
      alert("No reports selected!");
    }
  }

  render(){
    return (
      <div className="button-section unvalidate-button">
        <div className="button-desc"><b>This unvalidates the displayed reports that were previously validated.</b></div>
        <p><button onClick={() => this.handleClick()} className="btn btn-lg btn-info mar">Unvalidate</button></p>
      </div>
    );
  }
}

export default withTracker((props) => {
  return({
    organ: props.organ,
    reports: props.validatedReports,
  });
})(UnvalidateDisplayedButton);
