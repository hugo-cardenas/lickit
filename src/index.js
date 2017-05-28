import React from 'react';
import ReactDOM from 'react-dom';
import App from './render/App';
import registerServiceWorker from './registerServiceWorker';
// import './index.css';

import {Provider} from 'react-redux';
import createStore from './state/store';

const store = createStore();

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, 
    document.getElementById('root'));
registerServiceWorker();
