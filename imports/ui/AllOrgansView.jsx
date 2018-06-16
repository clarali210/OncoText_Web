import React, { Component } from 'react';

var extractions = require('/imports/extractions.json');

export default class AllOrgansView extends Component {

  renderOrgans(){
    var rows = [];
    for (const organ in extractions){
      rows.push(
        <div className="col-md-4 centered organ-div" key={organ+'-div'}>
          <a href={'/'+organ} className='organ-link'>
            <div className="organ-link-div" key={organ+'-link'}>
              {organ}
            </div>
          </a>
          <br/>
        </div>
      );
    }
    return (rows);
  }

  render(){
    return (
      <div className="row centered">
        <div className="col-md-12 view-bar row row-same-height centered">
          <div className="view-bar-title">
            <h2>Viewing Organs</h2>
            <div><i>{Object.keys(extractions).length} supported organs</i></div>
          </div>
        </div>

        <div className="col-md-12 centered">
          {this.renderOrgans()}
        </div>
      </div>
    );
  }
}
