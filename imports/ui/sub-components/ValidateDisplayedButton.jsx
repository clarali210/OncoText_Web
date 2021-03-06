import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { FlowRouter } from 'meteor/kadira:flow-router';

class ValidateDisplayedButton extends Component {

  handleValidate(){
    var validatedLabels = this.props.currentReport['validatedLabels'];
    for (var ind in this.props.checkedDisplayFilters){
      var extraction = this.props.checkedDisplayFilters[ind];
      if (!(this.props.currentReport['validatedLabels'].includes(extraction)) && !(this.props.currentReport['submittedLabels'].includes(extraction))){
        validatedLabels.push(extraction);
      }
    }
    Meteor.call('reports.updateReport', this.props.organ, this.props.currentReport['_id'], {validatedLabels: validatedLabels});

    this.handleNextReport("unvalidated");
  }

  handleUnvalidate(){
    var validatedLabels = this.props.currentReport['validatedLabels'];
    for (var ind in this.props.checkedDisplayFilters){
      validatedLabels = validatedLabels.filter((extraction) => {return extraction != this.props.checkedDisplayFilters[ind]});
    }
    Meteor.call('reports.updateReport', this.props.organ, this.props.currentReport['_id'], {validatedLabels: validatedLabels});

    this.handleNextReport("validated");
  }

  handleNextReport(validated){
    var displayed_ids = JSON.parse(localStorage.getItem(this.props.organ+'-report_ids'))[validated];
    var currentInd = displayed_ids.indexOf(this.props.currentReport['_id']._str);
    if (currentInd === displayed_ids.length-1){
      FlowRouter.go("/" + this.props.organ);
    } else {
      ReactDOM.findDOMNode(this).scrollTop = 0;
      FlowRouter.go("/" + this.props.organ + "/reports/" + displayed_ids[currentInd+1]);
    }
  }

  render(){

    if (this.props.currentReport['validatedLabels'].length > 0){
      var validated = "validated";
    } else {
      var validated = "unvalidated"
    }

    if (validated === "validated"){
      var unvalidateButton = (
        <div className="col-md-4">
          <br/>
          <p><button className="btn btn-lg btn-info mar" onClick={() => this.handleUnvalidate()}>
            Unvalidate Displayed Extractions
          </button></p>
        </div>
      );
    } else {
      var unvalidateButton = (
        <div className="col-md-4">
          <b>This report has no validated extractions.</b>
          <p><button className="btn btn-lg btn-info mar">
            Unvalidate Displayed Extractions
          </button></p>
        </div>
      );
    }

    if (this.props.allValidated){
      var validateButton = (
        <div className="col-md-4">
          <b>This report is already validated.</b>
          <p><button className="btn btn-lg btn-info mar">
            Validate Displayed Extractions
          </button></p>
        </div>
      );
    } else {
      var validateButton = (
        <div className="col-md-4">
          <br/>
          <p><button className="btn btn-lg btn-info mar" onClick={() => this.handleValidate()}>
            Validate Displayed Extractions
          </button></p>
        </div>
      );
    }

    return(
      <div className="button-section col-md-12 centered">
        {validateButton}
        <div className="col-md-4">
          <br/>
          <p><button className="btn btn-lg btn-info mar" onClick={() => this.handleNextReport(validated)}>
            Skip This Report
          </button></p>
        </div>
        {unvalidateButton}
      </div>
    );

  }
}

ValidateDisplayedButton.propTypes = {
  currentReport: PropTypes.object.isRequired,
  extractionLabels: PropTypes.array.isRequired
};

export default withTracker((props) => {

  var allValidated = true;
  for (var ind in props.extractionLabels){
    if (!(props.currentReport['validatedLabels'].includes(props.extractionLabels[ind])
    && !(props.currentReport['submittedLabels'].includes(props.extractionLabels[ind])))){
      allValidated = false;
    }
  }

  return({
    organ: props.organ,
    currentReport: props.currentReport,
    allValidated: allValidated,
    checkedDisplayFilters: Session.get(props.organ+'-checkedDisplayFilters'),
    prevDisplayedReports: Session.get(props.organ+'-prevDisplayedReports')
  });
})(ValidateDisplayedButton);
