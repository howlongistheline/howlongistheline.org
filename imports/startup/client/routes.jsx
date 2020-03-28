import React from 'react';
import { Router, Route, Switch } from 'react-router';
import history from 'history';

// route components
import Main from '../../ui/Index';
import AddLine from '../../ui/addLine';
import { ToastContainer } from 'react-toastify';


const browserHistory = history.createBrowserHistory();

export const renderRoutes = () => (
  // <Provider store={store}>
    <Router history={browserHistory}>
    <ToastContainer />
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/addLine" component={AddLine} />
      </Switch>
    </Router>
  // </Provider>
);