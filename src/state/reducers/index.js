import { combineReducers } from 'redux';
import error from './error';
import lick from './lick';
import search from './search';

const rootReducer = combineReducers({
  error,
  lick,
  search
});

export default rootReducer;
