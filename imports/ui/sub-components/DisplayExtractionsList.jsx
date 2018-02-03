import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';

var extractions = require('/imports/extractions.json');

class DisplayExtractionsList extends Component {

  handleCheckAllDisplay() {
    var checkedDisplayFilters = Session.get('checkedDisplayFilters');

    if (checkedDisplayFilters.length === this.props.extractionLabels.length){
      checkedDisplayFilters = [];
    } else {
      checkedDisplayFilters = this.props.extractionLabels;
    }

    Session.set('checkedDisplayFilters', checkedDisplayFilters);
    localStorage.setItem('checkedDisplayFilters', JSON.stringify(checkedDisplayFilters));
  }

  handleCheckDisplayItem(newDisplays) {
    Session.set('checkedDisplayFilters', newDisplays);
    localStorage.setItem('checkedDisplayFilters', JSON.stringify(newDisplays));
    console.log(newDisplays);
  }

  handleToggleCategories(category){
    var filterCategories = Session.get('filterCategories');
    filterCategories[category] = !filterCategories[category];

    Session.set('filterCategories', filterCategories);
    localStorage.setItem('filterCategories', JSON.stringify(Session.get('filterCategories')));
  }

  render(){
    var displayFilterList = [];

    // If the dropdown category is opened, display corresponding filters
    for (var category in extractions) {
      const categoryName = category;

      if (this.props.filterCategories[category]){
        displayFilterList.push(
          <div className="filter-category" onClick={() => this.handleToggleCategories(categoryName)} key={categoryName}>
            – {category}
          </div>
        );
        for (var filterName in extractions[category]){
          displayFilterList.push(
            <div className="display-filter-item" key={filterName+"-display-div"}>
              <Checkbox value={filterName} id={filterName}/>
              <label className="check checkbox-label-display" htmlFor={filterName}> {filterName}</label>
            </div>
          );
        }
      } else{
        displayFilterList.push(
          <div className="filter-category" onClick={() => this.handleToggleCategories(categoryName)} key={categoryName}>
            + {category}
          </div>
        );
      }
    }

    return (
      <div className="list-container">
        <div className="list-container-title">Display</div>
        <div>
          <input id="all" type="checkbox" checked={this.props.checkAllDisplay}
          onChange={() => this.handleCheckAllDisplay()}/>
          <label className="check checkbox-label-displayall" htmlFor="all"> All</label>
        </div>
        <CheckboxGroup name="displayFilters" value={this.props.checkedDisplayFilters}
        onChange={(newDisplays) => this.handleCheckDisplayItem(newDisplays)}>
          {displayFilterList}
        </CheckboxGroup>
      </div>
    )
  }
}

DisplayExtractionsList.propTypes = {
  extractionLabels: PropTypes.array.isRequired,
};

export default withTracker((props) => {
  // Initialize session variables
  var filterCategories = JSON.parse(localStorage.getItem('filterCategories') || '{}');
  if (Object.keys(filterCategories).length === 0){
    for (var category in extractions){
      filterCategories[category] = false;
    }
  }
  Session.set('filterCategories', filterCategories);

  var checkedDisplayFilters = JSON.parse(localStorage.getItem('checkedDisplayFilters') || '[]');
  Session.set('checkedDisplayFilters', checkedDisplayFilters);

  if (checkedDisplayFilters.length === props.extractionLabels.length){
    Session.set('checkAllDisplay', true);
  } else {
    Session.set('checkAllDisplay', false);
  }

  return({
    filterCategories: Session.get('filterCategories'),
    checkedDisplayFilters: Session.get('checkedDisplayFilters'),
    checkAllDisplay: Session.get('checkAllDisplay'),
    extractionLabels: props.extractionLabels
  });
})(DisplayExtractionsList);
