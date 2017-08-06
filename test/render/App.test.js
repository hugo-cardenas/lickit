import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from 'src/render/App';
import createStore from 'src/state/store';

// Mock the call electron.app.getPath('userData')
jest.mock('electron', () => {
    const tmp = require('tmp');

    const electron = {
        app: {
            getPath: name => {
                if (name === 'userData') {
                    return getUserDataPath();
                }
                return '';
            }
        }
    };

    let userDataPath;

    function getUserDataPath() {
        if (!userDataPath) {
            userDataPath = tmp.dirSync({ unsafeCleanup: true }).name;
        }
        return userDataPath;
    }

    return electron;
});

it('renders without crashing', () => {
    const div = document.createElement('div');
    const store = createStore();

    ReactDOM.render(
        <Provider store={store}>
      <App {...getProps()}/>
  </Provider>, div);
});

function getProps() {
    return {
        licks: [],
        handleCreate: () => {},
        handleSave: () => {},
        handleDelete: () => {},
        changeLickMode: () => {}
    };
}
