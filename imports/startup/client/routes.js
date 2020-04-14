import React from 'react';
import { Router, Route, Switch } from 'react-router';
import history from 'history';
import { ToastContainer } from 'react-toastify';
import { CookiesProvider } from 'react-cookie';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import AddLine from '../../ui/components/pages/AddLine';
import EditLine from '../../ui/components/pages/EditLine';
import ShopDetails from '../../ui/components/lib/ShopDetails';
import FeedBack from '../../ui/components/pages/Feedback';
import learntocode from '../../ui/components/pages/LearnToCode';
import Home from '../../ui/components/pages/Home';
import faq from '../../ui/components/pages/FAQ';
import duplicated from '../../ui/components/pages/Duplicated';
import Stocks from '../../ui/components/lib/Stocks';

// pick a date util library

const browserHistory = history.createBrowserHistory();

export const renderRoutes = () => (
  // <Provider store={store}>
  <Router history={browserHistory}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <CookiesProvider>
        <ToastContainer />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/addLine" component={AddLine} />
          <Route exact path="/editLine" component={EditLine} />
          <Route exact path="/shopDetails" component={ShopDetails} />
          <Route exact path="/feedback" component={FeedBack} />
          <Route exact path="/FAQ" component={faq} />
          <Route exact path="/learntocode" component={learntocode} />
          <Route exact path="/duplicated" component={duplicated} />
          <Route exact path="/stocks" component={Stocks} />
        </Switch>
      </CookiesProvider>
    </MuiPickersUtilsProvider>
  </Router>

  // </Provider>
);
