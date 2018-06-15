import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';

class DisplayExtractionsList extends Component {

  handleCheckAllDisplay() {
    var checkedDisplayFilters = Session.get(this.props.organ+'-checkedDisplayFilters');

    if (checkedDisplayFilters.length === this.props.extractionLabels.length){
      checkedDisplayFilters = [];
    } else {
      checkedDisplayFilters = this.props.extractionLabels;
    }

    Session.set(this.props.organ+'-checkedDisplayFilters', checkedDisplayFilters);
    localStorage.setItem(this.props.organ+'-checkedDisplayFilters', JSON.stringify(checkedDisplayFilters));
  }

  handleCheckDisplayItem(newDisplays) {
    Session.set(this.props.organ+'-checkedDisplayFilters', newDisplays);
    localStorage.setItem(this.props.organ+'-checkedDisplayFilters', JSON.stringify(newDisplays));
    console.log(newDisplays);
  }

  handleToggleCategories(category){
    var filterCategories = Session.get(this.props.organ+'-filterCategories');
    filterCategories[category] = !filterCategories[category];

    Session.set(this.props.organ+'-filterCategories', filterCategories);
    localStorage.setItem(this.props.organ+'-filterCategories', JSON.stringify(Session.get(this.props.organ+'-filterCategories')));
  }

  render(){
    var displayFilterList = [];

    // If the dropdown category is opened, display corresponding filters
    for (var category in this.props.extractions) {
      const categoryName = category;

      if (this.props.filterCategories[category]){
        displayFilterList.push(
          <div className="filter-category" onClick={() => this.handleToggleCategories(categoryName)} key={categoryName}>
            – {category}
          </div>
        );
        for (var filterName in this.props.extractions[category]){
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

export default withTracker((props) => {
  // Initialize session variables
  var filterCategories = JSON.parse(localStorage.getItem(props.organ+'-filterCategories') || '{}');
  if (Object.keys(filterCategories).length === 0){
    for (var category in props.extractions){
      filterCategories[category] = false;
    }
  }
  Session.set(props.organ+'-filterCategories', filterCategories);

  var checkedDisplayFilters = JSON.parse(localStorage.getItem(props.organ+'-checkedDisplayFilters') || '[]');
  Session.set(props.organ+'-checkedDisplayFilters', checkedDisplayFilters);

  if (checkedDisplayFilters.length === props.extractionLabels.length){
    Session.set(props.organ+'-checkAllDisplay', true);
  } else {
    Session.set(props.organ+'-checkAllDisplay', false);
  }

  return({
    filterCategories: Session.get(props.organ+'-filterCategories'),
    checkedDisplayFilters: Session.get(props.organ+'-checkedDisplayFilters'),
    checkAllDisplay: Session.get(props.organ+'-checkAllDisplay'),
    extractionLabels: props.extractionLabels
  });
})(DisplayExtractionsList);
