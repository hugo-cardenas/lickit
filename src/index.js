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

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

storage.get('state')
    .then(initialState => {
        if (isDev()) {
            initialState = getInitialState(15);
        }
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


const artists = [
  ['Django', 'Lady be good\nhttps://youtu.be/2Am48nza7JE?t=16s'],
  ['Django', 'Blues clair'],
  ['Django', 'Blues clair 2'],
  ['Charlie Parker', 'Confirmation'],
  ['Dizzy Gillespie', 'Perdido\nhttps://youtu.be/X8gCmtkuVgk?t=20s']
];

const tags = [
  'gypsy jazz',
  'bebop',
  'blues',
  'ii-V-I',
  'V-I',
  'altered scale',
  'diminished',
  'rhythm changes'
];

const url = "http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg";

const getInitialState = (numItems) => {
    const licks = _
        .range(numItems)
        .map(i => {
            const [artist, description] = artists[rand(0, artists.length - 1)];
            return {
                id: `${i + 1}`,
                artist,
                description,
                tracks: _.range(rand(0, 0)).map(i => {
                    return {
                        id: `${i}`,
                        url: url + `?a=${i}`
                    };
                }),
                tags: _.uniq(_.range(rand(0, 3)).map(() => tags[rand(0, tags.length - 1)]))
            };
        });

    return { licks: licks.map(lick => { return { lick }; }) };
};

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function isDev() {
    return process.env.ELECTRON_ENV === 'development';
}
