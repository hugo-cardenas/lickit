import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import errorMiddleware from './middleware/error';

export default (initialState) => {
    return createStore(rootReducer, initialState, applyMiddleware(errorMiddleware, thunk));
};
