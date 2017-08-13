import { combineReducers } from 'redux';
import error from './error';
import licks from './lick';
import search from './search';

const rootReducer = combineReducers({
    error,
    licks,
    search
});

export default rootReducer;
