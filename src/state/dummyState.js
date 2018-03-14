import _ from 'lodash';

const artists = [
  ['Django Reinhardt', 'Lady be good'],
  ['', 'Blues clair'],
  ['Coleman Hawkins', ''],
  ['Charlie Parker', 'Confirmation'],
  ['Dizzy Gillespie', 'A night in Tunisia']
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

export default function getDummyState(numItems) {
  const licksById = {};
  _.range(numItems).forEach(i => {
    const lick = createItem(i);
    licksById[lick.id] = _.omit(lick, ['id']);
  });

  const state = {
    lick: {
      editLickId: null,
      isCreationOpen: false,
      byId: licksById
    }
  };

  return state;
}

const createItem = i => {
  const [artist, description, background] = artists[
    rand(0, artists.length - 1)
  ];
  return {
    id: `${i + 1}`,
    artist,
    description,
    background,
    tracks: _.range(rand(1, 1)).map(createTrack),
    tags: _.uniq(_.range(rand(5, 5)).map(() => tags[rand(0, tags.length - 1)])),
    createdAt: i
  };
};

const createTrack = i => {
  return {
    id: 'cj99x1nk90001uvc9y3mjpjne'
  };
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
