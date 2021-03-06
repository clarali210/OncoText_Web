import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class Extractions extends Component {

  handleValueChange(extractionName, newValue){
    var updateObj = {};
    updateObj[extractionName] = newValue;
    Meteor.call('reports.updateReport', this.props.organ, this.props.currentReport['_id'], updateObj);
  }

  renderPossibleValues(extractionName){
    for (var category in this.props.extractions){
      if (Object.keys(this.props.extractions[category]).includes(extractionName)){
        var extractionValues = this.props.extractions[category][extractionName];
      }
    }

    return extractionValues.map((val) => (
      <MenuItem value={val} key={extractionName+"-"+val+"-extraction"} primaryText={val}/>
    ));
  }

  render(){
    var displayedExtractions = [];

    for (var ind in this.props.checkedDisplayFilters){
      const extractionName = this.props.checkedDisplayFilters[ind];
      var currentValue = this.props.currentReport[this.props.checkedDisplayFilters[ind]];

      if (this.props.currentReport['validatedLabels'].includes(extractionName)){
        displayedExtractions.push(
          <div className="report-extraction-item col-sm-12 col-md-6 col-lg-6 validated"
          key={extractionName+"-extraction-item"}>
            <SelectField fullWidth={true} floatingLabelText={extractionName}
            id={extractionName.replace(/\?|[- )(]/g,'')} value={currentValue}>
              <MenuItem value={currentValue} key={extractionName+"-"+currentValue+"-extraction"} primaryText={currentValue}/>
            </SelectField>
          </div>
        );
      } else if (this.props.currentReport['submittedLabels'].includes(extractionName)){
        displayedExtractions.push(
          <div className="report-extraction-item col-sm-12 col-md-6 col-lg-6 submitted"
          key={extractionName+"-extraction-item"}>
            <SelectField fullWidth={true} floatingLabelText={extractionName}
            id={extractionName.replace(/\?|[- )(]/g,'')} value={currentValue}>
              <MenuItem value={currentValue} key={extractionName+"-"+currentValue+"-extraction"} primaryText={currentValue}/>
            </SelectField>
          </div>
        );
      } else {
        displayedExtractions.push(
          <div className="report-extraction-item col-sm-12 col-md-6 col-lg-6" key={extractionName}>
            <SelectField fullWidth={true} floatingLabelText={extractionName}
            id={extractionName.replace(/\?|[- )(]/g,'')} value={currentValue}
            onChange={(event, index, value) => this.handleValueChange(extractionName, value)}>
              {this.renderPossibleValues(extractionName)}
            </SelectField>
          </div>
        );
      }
    }

    return (
      <div className="extractions">
        {displayedExtractions}
      </div>
    );
  }
}

export default withTracker((props) => {
  return ({
    organ: props.organ,
    extractions: props.extractions,
    currentReport: props.currentReport,
    checkedDisplayFilters: Session.get(props.organ+'-checkedDisplayFilters')
  });
})(Extractions);
