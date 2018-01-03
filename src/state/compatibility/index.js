/**
 * Updater reducers for updating older state structure to the latest,
 * after introducing breaking changes.
 *
 * We don't want to use these every single time state is reduced,
 * only once when reading the state from its persistent storage
 */

import { combineReducers } from 'redux';
import lick from './lick';

const rootReducer = combineReducers({
    lick
});

export default rootReducer;
