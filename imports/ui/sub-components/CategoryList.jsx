import React, { Component } from 'react';
import PropTypes from 'prop-types';

var extractions = require('/imports/extractions.json');

export default class CategoryList extends Component {

  constructor(props){
    super(props);

    // Initialize category toggler
    var filterCategories = JSON.parse(localStorage.getItem('filterCategories') || '{}');
    if (Object.keys(filterCategories).length === 0){
      for (var category in extractions){
        filterCategories[category] = false;
      }
    }
    Session.set('filterCategories', filterCategories);
  }

  handleToggleCategories(category){
    var filterCategories = Session.get('filterCategories');
    filterCategories[category] = !filterCategories[category];

    Session.set('filterCategories', filterCategories);
    localStorage.setItem('filterCategories', JSON.stringify(Session.get('filterCategories')));
  }

  render() {
    var filterList = [];

    // If the dropdown category is opened, display corresponding filters
    for (var category in extractions) {
      const categoryName = category;

      if (Session.get('filterCategories')[category]){
        filterList.push(
          <div className="filter-category" key={categoryName} onClick={() => this.handleToggleCategories(categoryName)}>
            – {category}
          </div>
        );

        for (var filterName in extractions[category]){
          var filterItem = [filterName, extractions[category][filterName]];

          const wrapFilterComponent = (component) => (
            <component filterName={filterName} filterItem={filterItem}/>
          );

          // const filterComponent = () => this.props.filterComponent;

          filterList.push(wrapFilterComponent(() => this.props.filterComponent));
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
        {filterList}
      </div>
    );
  }
}

CategoryList.propTypes = {
  filterComponent: PropTypes.object.isRequired,
};
