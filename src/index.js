import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './render/App';
import registerServiceWorker from './registerServiceWorker';
// import './index.css'; import {Provider} from 'react-redux'; import
// createStore from './state/store'; console.log('initial state', initialState);
// const store = createStore(initialState);

function getInitialState() {
  const initialLicks = _.shuffle([
    {
      "description": "Django - Lady be good",
      "tracks": [],
      "name": "123",
      "id": 3,
      tags: ['ii-V-I', 'gypsy jazz']
    }, {
      "description": "Django - Blues clair",
      "tracks": [],
      "name": "123",
      "id": 3,
      tags: ['I-IV', 'gypsy jazz', 'blues']
    }, {
      "description": "Django - Blues clair 2",
      "tracks": [],
      "name": "123",
      "id": 3,
      tags: ['ii-V-I', 'gypsy jazz', 'blues']
    }, {
      "description": "Charlie Parker - Confirmation",
      "tracks": [],
      "name": "perico",
      "id": 2,
      tags: ['ii-V-I', 'bebop']
    }, {
      "description": "Charlie Parker - Donna Lee",
      "tracks": [],
      "name": "foo",
      "id": 1,
      tags: ['ii-V-I', 'bebop']
    }, {
      "description": "Dizzy Gillespie - Perdido",
      "tracks": [],
      "name": "foo",
      "id": 1,
      tags: ['Dom7', 'bebop', 'Rhythm changes bridge']
    }, {
      "description": "Charlie Parker - Yardbird suite",
      "tracks": [],
      "name": "foo",
      "id": 1,
      tags: ['ii-V-I', 'bebop']
    }
  ]);

  const licks = _
    .range(27)
    .map(i => initialLicks[i % initialLicks.length])
    .map((lick, index) => {
      return {
        ...lick,
        id: index
      }
    });

  return {
    licks: licks.map(lick => {
      return {
        ...lick,
        mode: 'view'
      }
    })
  };
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
    default:
      return {
        ...state
      };
  }
}

function dispatch(action) {
  state = reduce(state, action);
  console.log('NEW STATE:', state);
  render(state);
}

function deleteLick(id) {
  return {type: 'DELETE_LICK', id}
}

state.handleDelete = (id) => {
  dispatch(deleteLick(id));
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
