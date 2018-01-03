import getActions from './lick';
import { getStorage } from '../../../track/storage';

export const {
    enableCreateLickForm,
    cancelCreateLickForm,
    createLick,
    updateLick,
    deleteLick,
    changeLickMode
} = getActions(getStorage());
