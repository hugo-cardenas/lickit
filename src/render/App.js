import React, {Component} from 'react';
import 'bulma/css/bulma.css';
import './App.css';
import Lick from './Lick/Lick';
import _ from 'lodash';

// import {bindActionCreators} from 'redux'; import {connect} from
// 'react-redux'; import deleteLick from '../state/actions/lick';

function renderLick(lick, handleDelete) {
  return <Lick
    mode="edit"
    id={lick.id}
    name={lick.name}
    description={lick.description}
    tags={lick.tags}
    handleDelete={handleDelete}/>;
}

function renderRow(chunk, handleDelete) {
  return (
    <div className="columns">
      {chunk.map(lick => {
        return <div className="column is-one-third">{renderLick(lick, handleDelete)}</div>
      })}
    </div>
  );
}

function getChunks(licks) {
  return _.chunk(licks, 3);
}

class App extends Component {
  render() {
    const {licks, handleDelete} = this.props;

    const chunks = getChunks(licks, handleDelete);

    return (
      <div className="container main-container">
        <header className="main-header">
          <h1 className="title">JazzRoutine</h1>
        </header>
        <div className="main-content">
          <div className="lick-list">
            {chunks.map(chunk => renderRow(chunk, handleDelete))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

// function mapStateToProps(state, props) {   return {licks: state.licks} }
// function mapDispatchToProps(dispatch) {   return {     // actions:
// bindActionCreators(lickActions, dispatch)     handleDelete: (id) =>
// dispatch(deleteLick(id))   } } export default connect(mapStateToProps,
// mapDispatchToProps)(App);