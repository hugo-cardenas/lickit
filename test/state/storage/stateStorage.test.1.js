import promisify from 'promisify-node';
import path from 'path';
import createStorage from 'src/state/storage/stateStorage';
const tmp = promisify('tmp');
const fs = promisify('fs');

// TODO Solve tmp dirs not being deleted
// TODO Put back to correct name

it('save and load state', () => {
    const state = {
        foo: 123,
        bar: 'abc',
        baz: [4, 5, 6]
    };
    const newState = {
        ...state,
        baz: [1, 2]
    };
    let storage;

    return getTmpDir().then(tmpDir => {
        const config = {
            filePath: tmpDir + '/state.json'
        };
        storage = createStorage(config);
        return storage.saveState(state);
    }).then(() => storage.loadState()).then(loadedState => {
        expect(loadedState).toEqual(state);
    })
    // Save a new state and load and check again
        .then(() => storage.saveState(newState)).then(() => storage.loadState()).then(loadedState => {
        expect(loadedState).toEqual(newState);
    });
});

it('load state from non existing file', () => {
    let storage;
    let filePath;

    return getTmpDir().then(tmpDir => {
        filePath = tmpDir + '/state.json';
        const config = {
            filePath
        };
        storage = createStorage(config);
        return storage.loadState();
    }).then(state => {
        expect(state).toEqual({});
    }).then(() => fs.readFile(filePath, 'utf-8')).then(data => {
        expect(data).toBe('{}');
    });
});

it('save state fails due to file not writable', () => {
    let storage;
    let filePath;

    return getTmpDir()
        .then(tmpDir => {
            filePath = tmpDir + '/state.json';
        })
        .then(() => fs.writeFile(filePath, 'foo'))
        // Remove write permissions
        .then(() => fs.chmod(filePath, '555'))
        .then(() => {
            const config = {
                filePath
            };
            storage = createStorage(config);
            return storage.saveState({foo: 'bar'});
        })
        .then(() => {
            throw new Error();
        })
        .catch(error => {
            expect(error.message).toEqual(expect.stringContaining('Unable to save state'));
            expect(error.message).toEqual(expect.stringContaining(JSON.stringify({foo: 'bar'})));
            expect(error.message).toEqual(expect.stringContaining('EACCES'));
        });
});

it('load state fails due to file not readable', () => {
    let storage;
    let filePath;

    return getTmpDir()
        .then(tmpDir => {
            filePath = tmpDir + '/state.json';
        })
        .then(() => fs.writeFile(filePath, 'foo'))
        // Remove read permissions
        .then(() => fs.chmod(filePath, '333'))
        .then(() => {
            const config = {
                filePath
            };
            storage = createStorage(config);
            return storage.loadState();
        })
        .then(() => {
            throw new Error();
        })
        .catch(error => {
            expect(error.message).toEqual(expect.stringContaining('Unable to load state'));
            expect(error.message).toEqual(expect.stringContaining('EACCES'));
        });
});

it('create storage with invalid config', () => {
    const config = {
        foo: 'bar'
    };

    try {
        const storage = createStorage(config);
        throw new Error();
    } catch (error) {
        expect(error.message).toEqual(expect.stringContaining('Invalid config'));
        expect(error.message).toEqual(expect.stringContaining('filePath'));
        expect(error.message).toEqual(expect.stringContaining(JSON.stringify(config)));
    }
});

function getTmpDir() {
    return tmp.dir({unsafeCleanup: true});
}