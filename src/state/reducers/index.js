import { combineReducers } from 'redux';
import licks from './lick';
import error from './error';

const rootReducer = combineReducers({
    error,
    licks
});

export default rootReducer;
