import React, { Component } from 'react';

export default class SearchBar extends Component {

  handleChangeSearch(e){
    Session.set('searchBar', e.target.value);
    localStorage.setItem('searchBar', e.target.value);

    Session.set('checkedReports', {unvalidated: [], validated: []});
  }

  handleClearSearch(){
    Session.set('searchBar', "");
    localStorage.removeItem('searchBar');

    Session.set('checkedReports', {unvalidated: [], validated: []});
  }

  render(){
    return (
      <div>
        Search: <input type="text" value={Session.get('searchBar')} placeholder=" Report Text / ID / EMPI"
        style={{width: 200}} onChange={(e) => this.handleChangeSearch(e)}/>
        <button className="delete" onClick={() => this.handleClearSearch()}>
          &times;
        </button>
      </div>
    );
  }
}
