import createStorage from './stateStorage';

// TODO Import config from central locator
const config = {
    filePath: '/tmp/foo.json'
};

export default createStorage(config);