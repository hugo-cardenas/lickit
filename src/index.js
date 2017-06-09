import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './render/App';
import registerServiceWorker from './registerServiceWorker';
// import './index.css'; import {Provider} from 'react-redux'; import
// createStore from './state/store'; console.log('initial state', initialState);
// const store = createStore(initialState);

const link = "http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg";

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const descriptions = [
  'Django - Lady be good' + "\n" + 'https://youtu.be/2Am48nza7JE?t=16s', 
  'Django - Blues clair', 
  'Django - Blues clair 2', 
  'Charlie Parker - Confirmation', 
  'Dizzy Gillespie - Perdido' + "\n" + 'https://youtu.be/X8gCmtkuVgk?t=20s'
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
    .range(5)
    .map(i => {
      return {
        id: i,
        description: descriptions[rand(0, descriptions.length - 1)],
        tracks: _.range(rand(0, 2)).map(i => {return {
          id: i,
          link: link + `?a=${i}`
        }}),
        tags: _.uniq(_.range(rand(0, 3)).map(i => tags[rand(0, tags.length - 1)]))
      };
    });

  return {licks};
}

let state = getInitialState();

function reduce(state, action) {
  switch (action.type) {
    case 'DELETE_LICK':
      return {
        ...state,
        licks: state
          .licks
          .filter(lick => lick.id !== action.id)
      }
    case 'SAVE_LICK':
      const newLick = action.lick;
      const licks = state.licks;
      const index = licks.findIndex(lick => lick.id === newLick.id);
      licks[index] = newLick;
      return {
        ...state,
        licks
      }
    default:
      return {
        ...state
      };
  }
}

function dispatch(action) {
  state = reduce(state, action);
  render(state);
}

function deleteLick(id) {
  return {type: 'DELETE_LICK', id}
}

function saveLick(lick) {
  return {type: 'SAVE_LICK', lick}
}

state.handleDelete = (id) => {
  dispatch(deleteLick(id));
}

state.handleSave = (lick) => {
  dispatch(saveLick(lick));
}

function render(state) {
  ReactDOM.render(
    <App {...state}/>, document.getElementById('root'));
}

render(state);

/*ReactDOM.render(
  <Provider store={store}>
  <App/>
</Provider>, document.getElementById('root'));*/
registerServiceWorker();
