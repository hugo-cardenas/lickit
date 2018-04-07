import App from './render/App';
import pify from 'pify';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import createStore from './state/store';
import jsonStorage from 'electron-json-storage';
import { mapStateToProps, mapDispatchToProps, mergeProps } from './map';
import createDummyState from './state/dummyState';
import 'font-awesome/css/font-awesome.css';
import 'bulma/css/bulma.css';
import './style/main.styl';

const storage = pify(jsonStorage);

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  App
);

storage.get('state').then(initialState => {
  if (isDev()) {
    initialState = createDummyState(4);
  }
  const store = createStore(initialState);
  // Add exec limit
  store.subscribe(
    _.throttle(() => {
      storage.set('state', store.getState());
    }, 200)
  );

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedApp />
    </Provider>,
    document.getElementById('root')
  );

  // applyDummyColors();
});

function isDev() {
  return process.env.ELECTRON_ENV === 'development';
}

function applyDummyColors() {
  const randomColor = require('randomcolor');
  Array.from(document.getElementsByTagName('div')).forEach(
    el => (el.style.backgroundColor = randomColor({ luminosity: 'light' }))
  );
}
