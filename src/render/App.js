import React, {Component} from 'react';
import 'bulma/css/bulma.css';
import './App.css';
import Lick from './Lick/Lick';
import _ from 'lodash';

// import {bindActionCreators} from 'redux'; import {connect} from
// 'react-redux'; import deleteLick from '../state/actions/lick';

function renderLick(lickState, handleDelete, handleSave) {
  return <Lick
    lick={lickState.lick}
    handleDelete={handleDelete}
    handleSave={handleSave}
    mode={lickState.mode}/>;
}

function renderRow(chunk, handleDelete, handleSave) {
  const chunkKey = chunk.map(lickState => lickState.lick.id).join('-');
  return (
    <div key={chunkKey} className="columns">
      {chunk.map(lickState => {
        return <div key={lickState.lick.id} className="column is-one-third">{renderLick(lickState, handleDelete, handleSave)}</div>
      })}
    </div>
  );
}

class App extends Component {
  render() {
    const {licks, handleDelete, handleSave, handleCreate} = this.props;
    const chunks = _.chunk(licks, 3);


    return (
      <div className="container main-container">
        <header className="main-header">
          <h1 className="title">JazzRoutine</h1>
        </header>
        <div className="main-content">
          <div className="lick-new">
            <a className="button" onClick={handleCreate}>
              <span className="icon">
                <i className="fa fa-plus-circle"></i>
              </span>
              <span>New lick</span>
            </a>
          </div>
          <div className="lick-list">
            {chunks.map(chunk => renderRow(chunk, handleDelete, handleSave))}
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