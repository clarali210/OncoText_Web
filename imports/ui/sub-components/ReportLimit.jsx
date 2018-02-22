import React, { Component } from 'react';

export default class ReportLimit extends Component {

  handleChangeReportLimit(e){
    Session.set('reportLimit', e.target.value);
    localStorage.setItem('reportLimit', e.target.value);

    Session.set('checkedReports', {unvalidated: [], validated: []});
  }

  render() {
    return (
      <div>
        Report Limit: <input type="text" value={Session.get('reportLimit')} style={{width: 100}}
        onChange={(e) => this.handleChangeReportLimit(e)}/>
      </div>
    );
  }
}
