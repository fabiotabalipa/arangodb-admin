import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import * as Config from '../config/public';
import * as Router from './router';

import '../assets/styles/index.css';

const renderApp = (path) => {
    ReactDOM.render(
        <App path={path}/>,
        document.getElementById('app')
    );
}
  
renderApp(window.location.pathname);
  
window.addEventListener('popstate', function (e) {
    renderApp(window.location.pathname);
});

if (Config.getNodeEnv === 'development') {
    module.hot.accept();
}
