import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import LickView from '../src/render/Lick/LickView';

storiesOf('LickView', module)
    .add('default', () => {
        const props = getProps();
        return <LickView {...props} />;
    })
    .add('empty', () => {
        const props = {
            ...getProps(),
            lick: getEmptyLick()
        };
        return <LickView {...props} />;
    });

const getProps = () => ({
    lick: {
        id: '42',
        artist: 'Charlie Parker',
        artistIndex: 1,
        description: 'Anthropology',
        tracks: [
            { id: 'a10', url: 'foo.abc' },
            { id: 'a20', url: 'bar.abc' }
        ],
        tags: ['rhythm changes', 'I-VI7-ii-V7']
    },
    editLick: action('Edit lick'),
    deleteLick: action('Delete lick')
});

const getEmptyLick = () => ({
    id: '42',
    artist: '',
    description: '',
    artistIndex: 1,
    tags: [],
    tracks: [
        { id: 'a10', url: 'foo.abc' }
    ]
});
