import { getPathResolver } from '../pathResolver';
import createStorage from './storage';

let storage;

export function getStorage() {
  if (!storage) {
    storage = createStorage(getPathResolver());
  }
  return storage;
}

export function setStorage(newStorage) {
  storage = newStorage;
}
