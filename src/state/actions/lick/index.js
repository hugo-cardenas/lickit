import getActions from './lick';
import { getStorage } from '../../../track/storage';

export const { createLick, updateLick, deleteLick, changeLickMode } = getActions(getStorage());
