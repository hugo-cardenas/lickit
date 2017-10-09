import electron from 'electron';
import path from 'path';
import createPathResolver from './pathResolver';

let pathResolver;

export function getPathResolver() {
    if (!pathResolver) {
        pathResolver = createPathResolver(getConfig());
    }
    return pathResolver;
}

function getConfig() {
    return {
        extension: 'wav',
        dir: path.join(getUserDataDir(), 'tracks')
    };
}

function getUserDataDir() {
    return (electron.app || electron.remote.app).getPath('userData');
}
