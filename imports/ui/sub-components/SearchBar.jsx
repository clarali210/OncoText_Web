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
    Session.set(this.props.organ+'-searchBar', obj);
    localStorage.setItem(this.props.organ+'-searchBar', JSON.stringify(obj));

    Session.set(this.props.organ+'-checkedReports', {unvalidated: [], validated: []});
    Session.set(this.props.organ+'-episodes-checkedReports', []);
    this.props.subs.stopNow();
  }

  handleClearSearch(){
    Session.set(this.props.organ+'-searchBar', {"op": "", "terms": [""], "string": ""});
    localStorage.removeItem(this.props.organ+'-searchBar');

    Session.set(this.props.organ+'-checkedReports', {unvalidated: [], validated: []});
    Session.set(this.props.organ+'-episodes-checkedReports', []);
    this.props.subs.stopNow();
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

export default withTracker((props) => {
  return ({
    organ: props.organ,
    string: Session.get(props.organ+'-searchBar')['string'],
    subs: props.subs,
  })
})(SearchBar);
