import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from 'src/render/App';
import createStore from 'src/state/store';
import { range } from 'lodash';
import { shallow } from 'enzyme';

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

it('renders expected number of licks', () => {
    const props = getProps();
    props.items = range(7).map(i => {
        return {
            lick: {
                id: 'c' + i,
                artist: '',
                description: '',
                tracks: [],
                tags: []
            }
        };
    });

    const component = shallow(<App {...props}/>);
    expect(component.find('.columns')).toHaveLength(3);
    expect(component.find('Lick')).toHaveLength(7);
});

it('create new lick', () => {
    const props = getProps();
    props.createLick = jest.fn();

    const component = shallow(<App {...props}/>);
    component.find('.lick-create').simulate('click');
    
    expect(props.createLick).toHaveBeenCalledTimes(1);
    expect(props.createLick).toBeCalledWith();
});

function getProps() {
    return {
        items: [],
        createLick: () => {},
        saveLick: () => {},
        deleteLick: () => {},
        changeLickMode: () => {}
    };
}
