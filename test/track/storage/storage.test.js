import libFs from 'fs';
import libTmp from 'tmp';
import path from 'path';
import pify from 'pify';
import createStorage from 'src/track/storage/storage';

const fs = pify(libFs);
const tmp = pify(libTmp);

it('save blob - success, create dir if does not exist', async() => {
    const content = 'foo bar';
    const blob = new Blob([content], { type: 'text/plain' });

    const tmpDir = await tmp.dir({ unsafeCleanup: true });
    const trackPath = path.join(tmpDir, 'foo', 'bar.wav');
    const resolveUrl = jest.fn().mockReturnValueOnce(trackPath);

    const storage = createStorage(resolveUrl);
    await storage.saveBlob(blob);

    expect((await fs.readFile(trackPath)).toString()).toBe(content);
    expect(resolveUrl).toHaveBeenCalledTimes(1);
    expect(resolveUrl.mock.calls[0][0]).toBeGreaterThan(0);
});

// TODO Impossible to test like this.
// Non-readable parent dir fails with EACCES before it will try to create the non-existing child dir
it.skip('save blob - fail creating dir', async() => {
    const content = 'foo bar';
    const blob = new Blob([content], { type: 'text/plain' });

    const tmpDir = await tmp.dir({ unsafeCleanup: true });
    const unwritableDir = path.join(tmpDir, 'abc');
    await fs.mkdir(unwritableDir);
    await fs.chmod(unwritableDir, 444);

    const trackDir = path.join(unwritableDir, 'foo');
    const trackPath = path.join(trackDir, 'bar.wav');
    const resolveUrl = jest.fn().mockReturnValueOnce(trackPath);

    const storage = createStorage(resolveUrl);
    try {
        await storage.saveBlob(blob);
        throw new Error();
    } catch (error) {
        expect(error.message).toEqual(expect.stringContaining('Unable to save blob'));
        expect(error.message).toEqual(expect.stringContaining('mkdir'));
        expect(resolveUrl).toHaveBeenCalledTimes(1);
        expect(resolveUrl.mock.calls[0][0]).toBeGreaterThan(0);
    }
});

it('save blob - fail writing file', async() => {
    const content = 'foo bar';
    const blob = new Blob([content], { type: 'text/plain' });

    const tmpDir = await tmp.dir({ unsafeCleanup: true });
    const trackDir = path.join(tmpDir, 'foo');
    await fs.mkdir(trackDir);
    await fs.chmod(trackDir, 444);

    const trackPath = path.join(trackDir, 'bar.wav');
    const resolveUrl = jest.fn().mockReturnValueOnce(trackPath);

    const storage = createStorage(resolveUrl);
    try {
        await storage.saveBlob(blob);
        throw new Error();
    } catch (error) {
        expect(error.message).toEqual(expect.stringContaining('Unable to save blob'));
        expect(error.message).toEqual(expect.stringContaining('permission denied'));
        expect(error.message).toEqual(expect.stringContaining('open'));
        expect(resolveUrl).toHaveBeenCalledTimes(1);
        expect(resolveUrl.mock.calls[0][0]).toBeGreaterThan(0);
    }
});

it('delete track - success', async() => {
    const tmpDir = await tmp.dir({ unsafeCleanup: true });
    const trackPath = path.join(tmpDir, '42.wav');
    await fs.writeFile(trackPath, 'foobar');
    const resolveUrl = jest.fn().mockReturnValueOnce(trackPath);

    const storage = createStorage(resolveUrl);
    await storage.deleteTrack(42);

    try {
        await fs.access(trackPath);
        throw new Error();
    } catch (error) {
        expect(error.code).toBe('ENOENT');
        expect(resolveUrl).toHaveBeenCalledTimes(1);
        expect(resolveUrl).toHaveBeenCalledWith(42);
    }
});

it('delete track - not found', async() => {
    const tmpDir = await tmp.dir({ unsafeCleanup: true });
    const trackPath = path.join(tmpDir, '42.wav');
    const resolveUrl = jest.fn().mockReturnValueOnce(trackPath);

    const storage = createStorage(resolveUrl);
    try {
        await storage.deleteTrack(42);
        throw new Error();
    } catch (error) {
        expect(error.message).toEqual(expect.stringContaining('Unable to delete track with id 42'));
        expect(error.message).toEqual(expect.stringContaining('ENOENT'));
        expect(resolveUrl).toHaveBeenCalledTimes(1);
        expect(resolveUrl).toHaveBeenCalledWith(42);
    }
});

it('delete track - fail deleting file', async() => {
    const tmpDir = await tmp.dir({ unsafeCleanup: true });
    const dir = path.join(tmpDir, 'foo');
    await fs.mkdir(dir);
    
    const trackPath = path.join(dir, '42.wav');
    await fs.writeFile(trackPath, 'foobar');
    await fs.chmod(dir, 444); 
    const resolveUrl = jest.fn().mockReturnValueOnce(trackPath);

    const storage = createStorage(resolveUrl);
    try {
        await storage.deleteTrack(42);
        throw new Error();
    } catch (error) {
        expect(error.message).toEqual(expect.stringContaining('Unable to delete track with id 42'));
        expect(error.message).toEqual(expect.stringContaining('EACCES'));
        expect(resolveUrl).toHaveBeenCalledTimes(1);
        expect(resolveUrl).toHaveBeenCalledWith(42);
    }
});
