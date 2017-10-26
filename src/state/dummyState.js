import _ from 'lodash';

const artists = [
    ['Django', 'Lady be good'],
    ['Django', 'Blues clair'],
    ['Django', 'Blues clair 2'],
    ['Charlie Parker Parker Parker', 'Confirmation'],
    ['Dizzy Gillespie', 'Perdido']
  ];

const tags = [
    'gypsy jazz',
    'bebop',
    'blues',
    'ii-V-I',
    'V-I',
    'altered scale',
    'diminished',
    'rhythm changes'
  ];

const url = "http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg";

export default function getDummyState(numItems) {
    const licks = _
        .range(numItems)
        .map(createItem);

    return {
        lick: {
            items: licks.map(lick => { return { lick }; })
        }
    };
}

const createItem = i => {
    const [artist, description] = artists[rand(0, artists.length - 1)];
    return {
        id: `${i + 1}`,
        artist,
        description,
        tracks: _.range(rand(1, 1)).map(createTrack),
        tags: _.uniq(_.range(rand(0, 3)).map(() => tags[rand(0, tags.length - 1)]))
    };
};

const createTrack = i => {
    return {
        // id: `${i}`,
        id: 'cj6dz5r8h0001bnc9ejpij80v',
        url: url + `?a=${i}`
    };
};

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
