import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class UnvalidateCheckedButton extends Component {

  handleUnvalidate(){
    Meteor.call('reports.unvalidateChecked', this.props.checkedValidated);
  }

  render(){
    if (this.props.checkedValidated === null || this.props.checkedValidated.length === 0) {
      return (
        <div className="submit-section float-left">
          <b>No reports selected.</b>
          <p><button className="btn btn-lg btn-info mar">Unvalidate</button></p>
        </div>
      );
    } else {
      return (
        <div className="submit-section float-left">
          <br/>
          <p><button onClick={() => this.handleUnvalidate()} role="button"
          className="btn btn-lg btn-info mar">Unvalidate</button></p>
        </div>
      );
    }
  }
}

export default withTracker((props) => {
  return({
    checkedValidated: Session.get('checkedReports')['validated']
  });
})(UnvalidateCheckedButton);
