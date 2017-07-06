import path from 'path';
import electron from 'electron';
import createUrlResolver from './resolver';

const userDataDir = (electron.app || electron.remote.app).getPath('userData');

const config = {
    extension: 'wav',
    dir: path.join(userDataDir, 'tracks')
};

export default createUrlResolver(config);
