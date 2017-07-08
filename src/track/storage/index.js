import { getUrlResolver } from '../urlResolver';
import createStorage from './storage';

let storage;

export function getStorage() {
    if (!storage) {
        storage = createStorage(getUrlResolver());
    }
    return storage;
}

export function setStorage(newStorage) {
    storage = newStorage;
};
