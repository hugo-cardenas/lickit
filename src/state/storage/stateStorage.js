import VError from 'verror';
import promisify from 'promisify-node';
const fs = promisify('fs');

/**
 * @param {Object} config {filePath}
 */
const createStorage = (config) => {
    if (!config.filePath || typeof config.filePath !== 'string') {
        throw new VError('Invalid config %s, invalid or missing "filePath"', JSON.stringify(config));
    }

    const saveState = (state) => {
        return fs
            .writeFile(config.filePath, JSON.stringify(state))
            .catch(error => wrapSaveError(error, state));
    }

    const loadState = () => {
        return fs
            .readFile(config.filePath)
            .then(data => JSON.parse(data))
            .catch(error => {
                // If the file doesn't exist, save an empty state and return it
                if (error.code === 'ENOENT') {
                    return saveState({}).then(() => {
                        return {};
                    });
                }
                throw error;
            })
            .catch(wrapLoadError);
    }

    const wrapSaveError = (error, state) => {
        throw new VError(error, 'Unable to save state %s', JSON.stringify(state));
    }

    const wrapLoadError = (error) => {
        throw new VError(error, 'Unable to load state');
    }

    return {saveState, loadState};
}

export default createStorage;