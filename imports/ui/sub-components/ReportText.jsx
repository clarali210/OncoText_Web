import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import Toggle from 'react-toggle';

class ReportText extends Component {

  toggleSegmented(){
    var segmented = Session.get(this.props.organ+'-segmented');
    Session.set(this.props.organ+'-segmented', !segmented);
    localStorage.setItem(this.props.organ+'-segmented', !segmented);
  }

  render(){
    if (this.props.currentReport) {
      if (this.props.segmented === false){
        var text = <p>{this.props.currentReport['Report_Text']}</p>;
      }
      else{
        var text = <p>{this.props.currentReport['Report_Text_Segmented']}</p>;
      }
      return (
        <div>
          <Toggle defaultChecked={this.props.segmented} icons={false}
          onChange={() => this.toggleSegmented()}/>
          <p className="segmented">
            Segmented
          </p>
          <br/>
          <pre className="report-text">
            {text}
          </pre>
        </div>
      );
    }
  }
}

ReportText.propTypes = {
  currentReport: PropTypes.object.isRequired,
};

export default withTracker((props) => {
  Session.set(props.organ+'-segmented', JSON.parse(localStorage.getItem(props.organ+'-segmented') || 'false'));

  return({
    organ: props.organ,
    currentReport: props.currentReport,
    segmented: Session.get(props.organ+'-segmented')
  });
})(ReportText);
