import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import FilterItem from './FilterItem.jsx';

class FilterList extends Component {

  handleToggleCategories(category){
    var filterCategories = Session.get(this.props.organ+'-filterCategories');
    filterCategories[category] = !filterCategories[category];

    Session.set(this.props.organ+'-filterCategories', filterCategories);
    localStorage.setItem(this.props.organ+'-filterCategories', JSON.stringify(Session.get(this.props.organ+'-filterCategories')));
  }

  handleClearAllFilters(){
    var filters = {};
    for (var category in this.props.extractions){
      for (var filterName in this.props.extractions[category]){
        filters[filterName] = null;
      }
    }
    Session.set(this.props.organ+'-filters', filters);
    localStorage.removeItem(this.props.organ+'-filters');
    this.props.subs.stopNow();
  }

  render() {
    var filterList = [];

    // If the dropdown category is opened, display corresponding filters
    for (var category in this.props.extractions) {
      const categoryName = category;

      if (this.props.filterCategories[category]){
        filterList.push(
          <div className="filter-category" key={categoryName} onClick={() => this.handleToggleCategories(categoryName)}>
            – {category}
          </div>
        );

        for (var filterName in this.props.extractions[category]){
          var filterItem = [filterName, this.props.extractions[category][filterName]];

          filterList.push(
            <div key={filterName+"-div"}>
              <FilterItem organ={this.props.organ} extraction={filterItem} subs={this.props.subs}/>
            </div>
          );
        }
      } else {
        filterList.push(
          <div className="filter-category" key={categoryName+"-div"} onClick={() => this.handleToggleCategories(categoryName)}>
            + {category}
          </div>
        );
      }
    }

    return (
      <div className="list-container">
        <button className="clear-all" onClick={() => this.handleClearAllFilters()}>
          Clear All
        </button>
        <div className="list-container-title">Filters</div>
        {filterList}
      </div>
    );
  }
}

export default withTracker((props) => {
  // Initialize category toggler
  var filterCategories = JSON.parse(localStorage.getItem(props.organ+'-filterCategories') || '{}');
  if (Object.keys(filterCategories).length === 0){
    for (var category in props.extractions){
      filterCategories[category] = false;
    }
  }
  Session.set(props.organ+'-filterCategories', filterCategories);

  return({
    organ: props.organ,
    extractions: props.extractions,
    filterCategories: Session.get(props.organ+'-filterCategories'),
    subs: props.subs,
  });
})(FilterList);
