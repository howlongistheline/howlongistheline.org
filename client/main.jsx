import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
// import App from '/imports/ui/App'
import ons from 'onsenui';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import { renderRoutes } from '../imports/startup/client/routes';

Meteor.startup(() => {
  // render(<App />, document.getElementById('react-target'));
  ons.ready(() => {
  render(renderRoutes(), document.getElementById('react-target'));
  })
});
