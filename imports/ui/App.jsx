import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import injectTapEventPlugin from 'react-tap-event-plugin';

const lightMuiTheme = getMuiTheme(lightBaseTheme);

injectTapEventPlugin();

// App component - represents the whole app
export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={lightMuiTheme}>
      <div className="container-fluid">

        <header>
          <div className="container-fluid">
            <div className="row-fluid">
              <div className="col-md-6 centered">
                <a href={"/"} style={{width: "100%"}}><h1>Pathology Validator</h1></a>
              </div>
              <div className="col-md-offset-2 col-md-4 centered logos">
                <img src="/images/mit_logo.svg" height="50px"/>
                <img src="/images/mgh_logo.png" height="50px"/>
              </div>
            </div>
          </div>
        </header>

        {this.props.content}

        <div className="row">
          <div className="footer">
            <div><b>Copyright MIT and MGH © All Rights Reserved</b></div>
            <i>A project by the <a href="http://nlp.csail.mit.edu/">Natural Language Processing Group at MIT CSAIL</a></i>
          </div>
        </div>

      </div>
      </MuiThemeProvider>
    );
  }
}
