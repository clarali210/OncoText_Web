import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { FlowRouterAutoscroll } from 'meteor/tomwasd:flow-router-autoscroll';
import { mount } from 'react-mounter';

import App from '/imports/ui/App.jsx';
import AllReportsView from '/imports/ui/AllReportsView.jsx';
import OneReportView from '/imports/ui/OneReportView.jsx';
import EpisodesView from '/imports/ui/EpisodesView.jsx';

FlowRouterAutoscroll.animationDuration = 500;

FlowRouter.route('/', {
  name: 'Main',
  action() {
    mount(App, {
      content: <AllReportsView/>,
    });
  },
});

FlowRouter.route('/reports/:_id', {
  name: 'Reports.show',
  action(params, queryParams) {
    mount(App, {
      content: <OneReportView/>,
    });
  },
});

FlowRouter.route('/episodes', {
  name: 'Episodes',
  action() {
    mount(App, {
      content: <EpisodesView/>,
    });
  },
});
