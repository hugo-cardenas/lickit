import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from 'src/render/App';
import createStore from 'src/state/store';
import { range } from 'lodash';
import { shallow } from 'enzyme';
import { TYPE_ARTIST } from 'src/search/filterTypes';

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

it('render without crashing', () => {
  const div = document.createElement('div');
  const store = createStore();

  ReactDOM.render(
    <Provider store={store}>
      <App {...getProps()} />
    </Provider>,
    div
  );
});

it('render expected number of licks', () => {
  const props = getProps();
  props.lick.licks = range(7).map(i => {
    return {
      id: 'c' + i,
      artist: '',
      description: '',
      tracks: [],
      tags: []
    };
  });

  const component = shallow(<App {...props} />);
  expect(component.find('Lick')).toHaveLength(7);
});

it('create new lick', () => {
  const props = getProps();
  props.lick.enableCreateLickForm = jest.fn();

  const component = shallow(<App {...props} />);
  component.find('#button-lick-create').simulate('click');

  expect(props.lick.enableCreateLickForm).toHaveBeenCalledTimes(1);
  expect(props.lick.enableCreateLickForm).toBeCalledWith();
});

it('render search', () => {
  const props = getProps();
  props.createLick = jest.fn();

  const component = shallow(<App {...props} />);
  const searchComponent = component.find('Search');

  expect(searchComponent.prop('filters')).toEqual([
    {
      type: TYPE_ARTIST,
      value: 'baz'
    }
  ]);
  expect(searchComponent.prop('input')).toEqual('foobar');
  expect(searchComponent.prop('suggestions')).toEqual([
    {
      title: TYPE_ARTIST,
      suggestions: ['foo', 'bar']
    }
  ]);
});

const getProps = () => {
  return {
    lick: {
      isCreationOpen: false,
      licks: [],
      enableCreateLickForm: () => {},
      cancelCreateLickForm: () => {},
      createLick: () => {},
      saveLick: () => {},
      deleteLick: () => {},
      changeLickMode: () => {}
    },
    search: {
      filters: [
        {
          type: TYPE_ARTIST,
          value: 'baz'
        }
      ],
      input: 'foobar',
      suggestions: [
        {
          title: TYPE_ARTIST,
          suggestions: ['foo', 'bar']
        }
      ],
      addFilter: () => {},
      removeFilter: () => {},
      setInput: () => {}
    }
  };
};
