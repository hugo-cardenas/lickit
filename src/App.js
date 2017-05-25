import React from 'react';
import 'bulma/css/bulma.css';
import './App.css';
import Lick from './Lick/Lick';
import _ from 'lodash';

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
  }, 
  {
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
  .map(i => initialLicks[i % initialLicks.length]);

const chunks = _.chunk(licks, 3);

function renderLick(lick) {
  return <Lick
    mode={Math.random() > 0.5
    ? "view"
    : "view"}
    id={lick.id}
    name={lick.name}
    description={lick.description}
    tags={lick.tags}/>;
}

function renderRow(chunk) {
  return (
    <div className="columns">
      {chunk.map(lick => {
        return <div className="column is-one-third">{renderLick(lick)}</div>
      })}
    </div>
  );
}

export default function () {
  return (
    <div className="container main-container">
      <header className="main-header">
        <h1 className="title">JazzRoutine</h1>
      </header>
      <div className="main-content">
        <div className="lick-collection">
          {chunks.map(chunk => renderRow(chunk))}
        </div>
      </div>
    </div>
  );
}
