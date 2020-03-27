import React from 'react';
import { Router, Route, Switch } from 'react-router';
import history from 'history';

// route components
import Main from '../../ui/Index';

import { ToastContainer } from 'react-toastify';

// import { Provider } from "react-redux";
// import store from "../../redux/store"

const browserHistory = history.createBrowserHistory();

export const renderRoutes = () => (
  // <Provider store={store}>
    <Router history={browserHistory}>
    <ToastContainer />
      <Switch>
        <Route exact path="/" component={Main} />
      </Switch>
    </Router>
  // </Provider>
);