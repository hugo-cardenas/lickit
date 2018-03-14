import React from 'react';
import { shallow } from 'enzyme';
import LickView from 'src/render/Lick/LickView';

test('render artist', () => {
  const component = shallow(<LickView {...getTestProps()} />);
  const artist = component.find('.artist');
  expect(artist.type()).toBe('p');
  expect(artist.text()).toBe('Charlie Foo');
});

test('render description', () => {
  const component = shallow(<LickView {...getTestProps()} />);
  expect(component.find('.description').text()).toBe('#2 | Foobar baz');
});

test('render track', () => {
  const props = getTestProps();
  const component = shallow(<LickView {...props} />);
  expect(component.find('Player').prop('src')).toEqual(
    props.lick.tracks[0].url
  );
});

test('render tags', () => {
  // Prop tags are expected to be already sorted (no sorting done in the component)
  const expectedTags = ['foo', 'bar', 'baz'];

  const component = shallow(<LickView {...getTestProps()} />);
  const tagsParent = component.find('.tags');
  expect(tagsParent.type()).toBe('div');

  const tagElements = component.find('.tags > .tag');
  expect(tagElements).toHaveLength(3);

  const tags = getTags(component);
  expect(tags).toEqual(expectedTags);
});

test('edit lick', () => {
  let props = getTestProps();
  props.editLick = jest.fn();

  const component = shallow(<LickView {...props} />);
  component
    .find('.dropdown-item')
    .at(0)
    .simulate('click');

  expect(props.editLick).toHaveBeenCalledTimes(1);
  expect(props.editLick).toBeCalledWith(props.lick.id);
});

test('delete lick', () => {
  let props = getTestProps();
  props.deleteLick = jest.fn();

  const component = shallow(<LickView {...props} />);
  component
    .find('.dropdown-item')
    .at(1)
    .simulate('click');

  expect(props.deleteLick).toHaveBeenCalledTimes(1);
  expect(props.deleteLick).toBeCalledWith(props.lick.id);
});

function getTags(component) {
  return component.find('.tag').map(element => element.text());
}

function getTestProps() {
  return {
    lick: {
      id: 'c42',
      artist: 'Charlie Foo',
      artistIndex: 2,
      description: 'Foobar baz',
      tracks: [{ id: 'a10', url: 'foo.abc' }, { id: 'a20', url: 'bar.abc' }],
      tags: ['foo', 'bar', 'baz']
    },
    editLick: () => {},
    deleteLick: () => {}
  };
}
