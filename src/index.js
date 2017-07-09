// import './index.css'; 
import App from './render/App';
import pify from 'pify';
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import createStore from './state/store';
import jsonStorage from 'electron-json-storage';
import { mapStateToProps, mapDispatchToProps } from './map';

const storage = pify(jsonStorage);

// TODO Handle errors

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

storage.get('state')
    .then(initialState => {
        const store = createStore(initialState);
        // Add exec limit
        store.subscribe(() => {
            storage.set('state', store.getState());
        });

        ReactDOM.render(
            <Provider store={store}>
        <ConnectedApp/>
        </Provider>, document.getElementById('root'));
    });
