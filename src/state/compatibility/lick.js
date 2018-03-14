const fs = require('fs');
const _ = require('lodash');

const state = require('/tmp/state.json');

const indexItemsById = items => {
  const byId = {};
  items.forEach(item => {
    byId[item.lick.id] = _.omit(item.lick, ['id']);
  });
  return byId;
};

const newState = {
  ...state,
  lick: {
    isCreationOpen: false,
    editLickId: null,
    byId: indexItemsById(state.lick.items)
  }
};

fs.writeFileSync('/tmp/newState.json', JSON.stringify(newState));
