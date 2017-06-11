import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import createStore from 'src/state/store';
import App from 'src/render/App';

it('renders without crashing', () => {

  const div = document.createElement('div');
  const store = createStore();

  ReactDOM.render(
    <Provider store={store}>
    <App/>
  </Provider>, div);
});
