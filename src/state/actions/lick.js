import {
  LICK_CREATE,
  LICK_UPDATE,
  LICK_DELETE
} from './types';

function createLick() {
  return {type: LICK_CREATE}
}

function updateLick(lick) {
  return {type: LICK_UPDATE, lick}
}

function deleteLick(id) {
  return {type: LICK_DELETE, id}
}

export {createLick, updateLick, deleteLick};
