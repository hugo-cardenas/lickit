import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import LickView from '../src/render/Lick/LickView';

import 'bulma/css/bulma.css';
import '../src/style/main.styl';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);

storiesOf('LickView', module)
  .add('standard lick', () => {
    const props = {
      lick: {
        id: 'c42',
        artist: 'Charlie Foo',
        artistIndex: 2,
        description: 'Foobar baz',
        tracks: [
            { id: 'a10', url: 'foo.abc' },
            { id: 'a20', url: 'bar.abc' }
        ],
        tags: ['foo', 'bar', 'baz']
      },
      editLick: () => {},
      deleteLick: () => {}
    };
    return <LickView {...props} />;
  });