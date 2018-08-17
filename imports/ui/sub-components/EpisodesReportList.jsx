import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

import EpisodesReportItem from './EpisodesReportItem.jsx';

class EpisodesReportList extends Component {

  render() {
    var rows = [];
    if (this.props.loading){
      rows.push(<img src="/images/loading.gif" height="150vw" key={"loading-"+this.props.name}/>);
    } else {
      var reports = this.props.reports;
      for (var ind in reports){
        rows.push(<EpisodesReportItem report={reports[ind]} key={reports[ind]._id}/>);
      }
    }

    return (
      <div className="list-container">
        <div className="list-container-title">{this.props.containerTitle}</div>
        <div>
          {rows}
        </div>
      </div>
    );
  }
}

export default withTracker((props) => {

  return({
    organ: props.organ,
    name: props.name,
    reports: props.reports,
    containerTitle: "Episodes of Care",
    loading: Session.get(props.organ+'-episodes-query') === "...",
  });
})(EpisodesReportList);
