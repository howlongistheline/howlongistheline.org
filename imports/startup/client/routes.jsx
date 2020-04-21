import React from 'react';
import { Router, Route, Switch } from 'react-router';
import history from 'history';

// route components
// import Main from '../../ui/Index';
import AddLine from '../../ui/addLine';
import EditLine from '../../ui/editLine';
import ShopDetails from '../../ui/ShopDetails';
import FeedBack from '../../ui/feedback'
import learntocode from '../../ui/learntocode'
import Nearme from '../../ui/nearme'
import faq from '../../ui/FAQ'
import duplicated from '../../ui/Duplicated'
import Stocks from '../../ui/Stocks'
import EditLocation from '../../ui/editLocation'
import { ToastContainer } from 'react-toastify';
import { CookiesProvider } from 'react-cookie';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

// pick a date util library
import MomentUtils from '@date-io/moment';

const browserHistory = history.createBrowserHistory();


export const renderRoutes = () => (
  // <Provider store={store}>
    <Router history={browserHistory}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
    <CookiesProvider>
    <ToastContainer />
      <Switch>
        <Route exact path="/" component={Nearme} />
        <Route exact path="/addLine" component={AddLine} />
        <Route exact path="/editLine" component={EditLine} />
        <Route exact path="/shopDetails" component={ShopDetails} />
        <Route exact path="/feedback" component={FeedBack} />
        <Route exact path="/FAQ" component={faq} />
        <Route exact path="/learntocode" component={learntocode} />
        <Route exact path="/duplicated" component={duplicated} />
        <Route exact path="/stocks" component={Stocks} />
        <Route exact path="/editLocation" component={EditLocation} />
      </Switch>
      </CookiesProvider>
      </MuiPickersUtilsProvider>
    </Router>

  // </Provider>
);
