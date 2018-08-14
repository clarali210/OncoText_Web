import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class SearchBar extends Component {
  constructor(props){
    super(props);
    this.state = this.props.query;
  }

  handleChangeSearch(e){
    var entry = e.target.value;
    if (entry.includes("AND")){
      this.state = {"op": "AND", "terms": entry.split(" AND "), "string": entry};
    } else if (entry.includes("OR")){
      this.state = {"op": "OR", "terms": entry.split(" OR "), "string": entry};
    } else {
      this.state = {"op": "", "terms": [entry], "string": entry};
    }

    this.forceUpdate();
  }

  handleSubmit(e){
    if (e.keyCode == 13){
      Session.set(this.props.organ+'-searchBar', this.state);
      localStorage.setItem(this.props.organ+'-searchBar', JSON.stringify(this.state));

      if (this.props.subs){
        this.props.subs.stopNow();
      }

      e.preventDefault();
    }
  }

  handleClearSearch(){
    this.state = {"op": "", "terms": [""], "string": ""};
    Session.set(this.props.organ+'-searchBar', {"op": "", "terms": [""], "string": ""});
    localStorage.removeItem(this.props.organ+'-searchBar');

    if (this.props.subs){
      this.props.subs.stopNow();
    }
  }

  render(){
    return (
      <div>
        Search: <input type="text" value={this.state['string']} placeholder=" Report Text / ID / EMPI with AND / OR"
        style={{width: 300}} onKeyDown={(e) => this.handleSubmit(e)} onChange={(e) => this.handleChangeSearch(e)} />
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
    query: Session.get(props.organ+'-searchBar'),
    subs: props.subs,
  })
})(SearchBar);
