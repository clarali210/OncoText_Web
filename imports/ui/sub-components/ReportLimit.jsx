import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class ReportLimit extends Component {

  handleChangeReportLimit(e){
    Session.set(this.props.organ+'-reportLimit', e.target.value);
    localStorage.setItem(this.props.organ+'-reportLimit', e.target.value);

    Session.set(this.props.organ+'-checkedReports', {unvalidated: [], validated: []});
    Session.set(this.props.organ+'-episodes-checkedReports', []);
    if (subs){
      this.props.subs.stopNow();
    }
  }

  render() {
    return (
      <div>
        Report Limit: <input type="text" value={this.props.val} style={{width: 100}}
        onChange={(e) => this.handleChangeReportLimit(e)}/>
      </div>
    );
  }
}

export default withTracker((props) => {
  return {
    organ: props.organ,
    val: Session.get(props.organ+'-reportLimit'),
    subs: props.subs,
  };
})(ReportLimit);
