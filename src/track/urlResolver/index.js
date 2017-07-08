import electron from 'electron';
import path from 'path';
import createUrlResolver from './urlResolver';

let urlResolver;

export function getUrlResolver() {
    if (!urlResolver) {
        urlResolver = createUrlResolver(getConfig());
    }
    return urlResolver;
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
