import getActions from './lick';
import { getStorage } from '../../../track/storage';

export const {
  openCreation,
  cancelCreation,
  createLick,
  updateLick,
  deleteLick,
  changeLickMode
} = getActions(getStorage());
