import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import FilterItem from './FilterItem.jsx';

var extractions = require('/imports/extractions.json');

class FilterList extends Component {

  handleToggleCategories(category){
    var filterCategories = Session.get('filterCategories');
    filterCategories[category] = !filterCategories[category];

    Session.set('filterCategories', filterCategories);
    localStorage.setItem('filterCategories', JSON.stringify(Session.get('filterCategories')));
  }

  handleClearAllFilters(){
    var filters = {};
    for (var category in extractions){
      for (var filterName in extractions[category]){
        filters[filterName] = null;
      }
    }
    Session.set('filters', filters);
    localStorage.removeItem('filters');
  }

  render() {
    var filterList = [];

    // If the dropdown category is opened, display corresponding filters
    for (var category in extractions) {
      const categoryName = category;

      if (this.props.filterCategories[category]){
        filterList.push(
          <div className="filter-category" key={categoryName} onClick={() => this.handleToggleCategories(categoryName)}>
            – {category}
          </div>
        );

        for (var filterName in extractions[category]){
          var filterItem = [filterName, extractions[category][filterName]];

          filterList.push(
            <div key={filterName+"-div"}>
              <FilterItem extraction={filterItem}/>
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

export default withTracker(() => {
  // Initialize category toggler
  var filterCategories = JSON.parse(localStorage.getItem('filterCategories') || '{}');
  if (Object.keys(filterCategories).length === 0){
    for (var category in extractions){
      filterCategories[category] = false;
    }
  }
  Session.set('filterCategories', filterCategories);

  return({
    filterCategories: Session.get('filterCategories')
  });
})(FilterList);
