import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
// import App from '/imports/ui/App'
import ons from 'onsenui';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import { renderRoutes } from '../imports/startup/client/routes';
import 'react-toastify/dist/ReactToastify.css';
import i18n from 'meteor/universe:i18n'; // <--- 1


Meteor.startup(() => {
  // render(<App />, document.getElementById('react-target'));
  ons.ready(() => {
    i18n.setOptions({  // <--- 6
      defaultLocale: 'en'
    });
    // i18n.setLocale("en-US");
    // i18n.setLocale('zh').then((result, error)=>{
    //   console.log(result);
    //   console.log(error);
    //   // console.log(i18n.__('common.name'))
    //   // console.log(i18n.__("ui", "ok"))
    //   // try{
    //   //   import ('./i18n/zh.i18n.yml');
    //   //   console.log(i18n.__("ui", "ok"))
    //   //   }
    //   //   catch(err){
    //   //     console.log(err)
    //   //   }
    // });
  render(renderRoutes(), document.getElementById('react-target'));
  })
});
