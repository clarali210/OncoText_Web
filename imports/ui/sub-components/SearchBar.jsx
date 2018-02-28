import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class SearchBar extends Component {

  handleChangeSearch(e){
    var entry = e.target.value;
    if (entry.includes("AND")){
      var obj = {"op": "AND", "terms": entry.split(" AND "), "string": entry}
    } else if (entry.includes("OR")){
      var obj = {"op": "OR", "terms": entry.split(" OR "), "string": entry}
    } else {
      var obj = {"op": "", "terms": [entry], "string": entry}
    }
    Session.set('searchBar', obj);
    localStorage.setItem('searchBar', JSON.stringify(obj));

    Session.set('checkedReports', {unvalidated: [], validated: []});
  }

  handleClearSearch(){
    Session.set('searchBar', {"op": "", "terms": [""], "string": ""});
    localStorage.removeItem('searchBar');

    Session.set('checkedReports', {unvalidated: [], validated: []});
  }

  render(){
    return (
      <div>
        Search: <input type="text" value={this.props.string} placeholder=" Report Text / ID / EMPI with AND / OR"
        style={{width: 300}} onChange={(e) => this.handleChangeSearch(e)}/>
        <button className="delete" onClick={() => this.handleClearSearch()}>
          &times;
        </button>
      </div>
    );
  }
}

export default withTracker(() => {
  return ({
    string: Session.get('searchBar')['string'],
  })
})(SearchBar);
