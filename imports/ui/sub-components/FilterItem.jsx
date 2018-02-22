import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

class FilterItem extends Component {

  handleChangeFilter(filterName, newValue){
    var filters = Session.get('filters');
    filters[filterName] = newValue;

    Session.set('filters', filters);
    localStorage.setItem('filters', JSON.stringify(Session.get('filters')));

    Session.set('checkedReports', {unvalidated: [], validated: []});
  }

  handleClearFilter(filterName){
    var filters = Session.get('filters');
    filters[filterName] = null;

    Session.set('filters', filters);
    localStorage.setItem('filters', JSON.stringify(Session.get('filters')));

    Session.set('checkedReports', {unvalidated: [], validated: []});
  }

  render() {
    var dropdownFields = [];
    var filterName = this.props.extraction[0];
    var potentialValues = this.props.extraction[1];

    for (var ind in potentialValues){
      var value = potentialValues[ind];
      dropdownFields.push(<MenuItem value={value} primaryText={value} key={filterName+"-"+value}/>);
    }

    // If this filter currently has a value, add a delete button for that individual filter
    if (Session.get('filters')[filterName] !== null){
      var deleteButton = (
        <button className="delete" onClick={() => this.handleClearFilter(filterName)}>
          &times;
        </button>
      );
    } else{
      var deleteButton = (
        <button className="delete">
          &nbsp;
        </button>
      );
    }

    return (
      <div className="col-md-12" key={filterName+"-item"}>
        {deleteButton}
        <div className="filter-extraction-item">
          <SelectField floatingLabelText={filterName} value={this.props.filters[filterName]} fullWidth={true}
          key={filterName+"-filter"} onChange={(event, index, value) => this.handleChangeFilter(filterName, value)}>
            {dropdownFields}
          </SelectField>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  return({
    filters: Session.get('filters')
  });
})(FilterItem);

FilterItem.propTypes = {
  extraction: PropTypes.array.isRequired,
};
