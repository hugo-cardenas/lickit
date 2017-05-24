import React from 'react';
import 'bulma/css/bulma.css';
import './App.css';
import Lick from './Lick/Lick';
import _ from 'lodash';

const initialLicks = [
  {
    "description": "Django - Lady be Good",
    "tracks": [],
    "name": "123",
    "id": 3,
    tags: ['ii-V-I']
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
    "description": "Charlie Parker - Perdido",
    "tracks": [],
    "name": "foo",
    "id": 1,
    tags: ['Dom7', 'bebop', 'Rhythm changes bridge']
  }
];

const licks = _
  .range(11)
  .map(i => initialLicks[i % initialLicks.length]);

const chunks = _.chunk(licks, 3);

function renderLick(lick) {
  return <Lick
    className="column is-one-third"
    key={Math.random()}
    id={lick.id}
    name={lick.name}
    description={lick.description}
    tags={lick.tags}/>;
}

export default function () {
  return (
    <div className="container main-container">
      <header className="main-header">
        <h1 className="title">JazzRoutine</h1>
      </header>
      <div className="main-content">
        <div>
          {chunks.map(chunk => {
            return (
              <div className="columns">
                {chunk.map(lick => renderLick(lick))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
