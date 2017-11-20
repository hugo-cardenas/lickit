import getActions from './lick';
import { getStorage } from '../../../track/storage';

export const { enableCreateForm, cancelCreateForm, createLick, updateLick, deleteLick, changeLickMode } = getActions(getStorage());
