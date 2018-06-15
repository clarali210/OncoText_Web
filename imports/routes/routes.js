import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { FlowRouterAutoscroll } from 'meteor/tomwasd:flow-router-autoscroll';
import { mount } from 'react-mounter';

import App from '/imports/ui/App.jsx';
import AllOrgansView from '/imports/ui/AllOrgansView.jsx';
import AllReportsView from '/imports/ui/AllReportsView.jsx';
import OneReportView from '/imports/ui/OneReportView.jsx';
import EpisodesView from '/imports/ui/EpisodesView.jsx';

var extractions = require('/imports/extractions.json');
import { Reports } from '/imports/api/reports.js';
import { Episodes } from '/imports/api/episodes.js';

FlowRouterAutoscroll.animationDuration = 500;

FlowRouter.route('/', {
  name: 'Main',
  action() {
    mount(App, {
      content: <AllOrgansView/>,
    });
  },
});

for (const organ in extractions){
  const db = Reports[organ];
  const organ_extractions = extractions[organ];

  FlowRouter.route('/'+organ, {
    name: organ,
    action(params, queryParams) {
      mount(App, {
        content: <AllReportsView db={db} organ={organ} extractions={organ_extractions}/>,
      });
    },
  });

  FlowRouter.route('/'+organ+'/reports/:_id', {
    name: organ+'Reports.show',
    action(params, queryParams) {
      mount(App, {
        content: <OneReportView db={db} organ={organ} extractions={organ_extractions}/>,
      });
    },
  });

  const episodesdb = Episodes[organ];

  FlowRouter.route('/'+organ+'/episodes', {
    name: organ+'Episodes',
    action() {
      mount(App, {
        content: <EpisodesView db={episodesdb} organ={organ} extractions={organ_extractions}/>,
      });
    },
  });
}
