import React from 'react';

import Intro from './routes/Intro';
import Import from './routes/Import';
import Export from './routes/Export';
import Properties from './routes/Properties';
import Create from './routes/Create';
import NotFound from './routes/NotFound';

const NotFoundRoute = {
  path: '.*',
  component: (<NotFound />)
};

const parsePath = (path) => {
  const decodedPath = decodeURIComponent(path);
  let key = decodedPath, params = new Map();
  const x = decodedPath.split(';');

  if (x.length >= 2) {
    key = x[0];
    x.splice(0, 1);
    x.forEach((part) => {
      const y = part.split('=');
      params.set(y[0], y[1]);
    });
  }

  return { key, params } ;
}

const getRouteByPath = (path) => {
  const { key } = parsePath(path);

  switch (key) {
    case '/':
      return {
        component: (<Intro />)
      };
    case '/importar':
      return {
        component: (<Import />)
      };
    case '/exportar':
      return {
        component: (<Export />)
      };
    case '/propriedades':
      return {
        component: (<Properties />)
      };
    case '/criar':
      return {
        component: (<Create />)
      };
    default:
      return NotFoundRoute;
  }
}

export const renderPath = (path) => {
  const route = getRouteByPath(path);
  return route.component;
};

export const goPath = (path) => {
  window.history.pushState(null, null, path);
  window.dispatchEvent(new window.PopStateEvent('popstate'));
};
