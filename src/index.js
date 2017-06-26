import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './render/App';
import registerServiceWorker from './registerServiceWorker';
// import './index.css'; 
import {Provider} from 'react-redux'; 
import createStore from './state/store';
// import storage from './state/storage';

const link = "http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg";

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const descriptions = [
  'Django - Lady be good\nhttps://youtu.be/2Am48nza7JE?t=16s', 
  'Django - Blues clair', 
  'Django - Blues clair 2', 
  'Charlie Parker - Confirmation', 
  'Dizzy Gillespie - Perdido\nhttps://youtu.be/X8gCmtkuVgk?t=20s'
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
]

function getInitialState() {
  const licks = _
    .range(2)
    .map(i => {
      return {
        id: i + 1,
        description: descriptions[rand(0, descriptions.length - 1)],
        tracks: _.range(rand(0, 2)).map(i => {return {
          id: i,
          link: link + `?a=${i}`
        }}),
        tags: _.uniq(_.range(rand(0, 3)).map(i => tags[rand(0, tags.length - 1)]))
      };
    });

  return {licks: licks.map(lick => { return {lick}; })};
}

// TODO Handle errors
const initialState = getInitialState();
const store = createStore(initialState);
ReactDOM.render(
  <Provider store={store}>
  <App/>
</Provider>, document.getElementById('root'));

registerServiceWorker();
  

// storage.loadState()
//   .then(initialState => {
//     const store = createStore(initialState);
//     store.subscribe(() => {
//       console.log('SAVING STATE', store.getState());
//       storage.saveState(store.getState());
//     });

//     ReactDOM.render(
//       <Provider store={store}>
//       <App/>
//     </Provider>, document.getElementById('root'));

//     registerServiceWorker();
//   });
