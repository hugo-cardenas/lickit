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
    .range(0)
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

  return {licks: licks.map(lick => { return {lick}; })};
}

let state = getInitialState();

function reduce(state, action) {
  switch (action.type) {
    case 'DELETE_LICK':
      return {
        ...state,
        licks: state
          .licks
          .filter(lick => lick.lick.id !== action.id)
      };
    case 'SAVE_LICK':
      console.log(action.lick);
      const newLick = {lick: action.lick};
      const licks = state.licks;
      console.log(state.licks);
      const index = licks.findIndex(lick => lick.lick.id === newLick.lick.id);
      licks[index] = newLick;
      // console.log({
      //   ...state,
      //   licks
      // });
      return {
        ...state,
        licks
      };
    case 'CREATE_LICK':
      return {
        ...state,
        licks: [{lick: createEmptyLick(), mode: 'edit'}, ...state.licks]
      }
    default:
      return {
        ...state
      };
  }
}

function createEmptyLick() {
  return {
    id: rand(1, 9999999),
    description: '',
    tracks: [],
    tags: [],
    mode: 'edit'
  };
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

function createLick() {
  return {type: 'CREATE_LICK'}
}

state.handleDelete = (id) => {
  dispatch(deleteLick(id));
}

state.handleSave = (lick) => {
  dispatch(saveLick(lick));
}

state.handleCreate = () => {
  dispatch(createLick());
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
