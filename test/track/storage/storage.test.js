import libFs from 'fs';
import libTmp from 'tmp';
import path from 'path';
import pify from 'pify';
import createStorage from 'src/track/storage/storage';

const fs = pify(libFs);
const tmp = pify(libTmp);

it('store a blob and create dir if does not exist', async() => {
    const content = 'foo bar';
    const blob = new Blob([content], { type: 'text/plain' });

    const tmpDir = await tmp.dir({ unsafeCleanup: true });
    const trackPath = path.join(tmpDir, 'foo', 'bar.wav');
    const resolveUrl = () => trackPath;

    const storage = createStorage(resolveUrl);
    await storage.saveBlob(blob);

    expect((await fs.readFile(trackPath)).toString()).toBe(content);
});

// TODO Impossible to test like this.
// Non-readable parent dir fails with EACCES before it will try to create the non-existing child dir
it.skip('fail creating dir', async() => {
    const content = 'foo bar';
    const blob = new Blob([content], { type: 'text/plain' });

    const tmpDir = await tmp.dir({ unsafeCleanup: true });
    const unwritableDir = path.join(tmpDir, 'abc');
    await fs.mkdir(unwritableDir);
    await fs.chmod(unwritableDir, 444);

    const trackDir = path.join(unwritableDir, 'foo');
    const trackPath = path.join(trackDir, 'bar.wav');
    const resolveUrl = () => trackPath;

    const storage = createStorage(resolveUrl);
    try {
        await storage.saveBlob(blob);
        throw new Error();
    } catch (error) {
        expect(error.message).toEqual(expect.stringContaining('Unable to save blob'));
        expect(error.message).toEqual(expect.stringContaining('mkdir'));
    }
});

it('fail writing file', async() => {
    const content = 'foo bar';
    const blob = new Blob([content], { type: 'text/plain' });

    const tmpDir = await tmp.dir({ unsafeCleanup: true });
    const trackDir = path.join(tmpDir, 'foo');
    await fs.mkdir(trackDir);
    await fs.chmod(trackDir, 444);

    const trackPath = path.join(trackDir, 'bar.wav');
    const resolveUrl = () => trackPath;

    const storage = createStorage(resolveUrl);
    try {
        await storage.saveBlob(blob);
        throw new Error();
    } catch (error) {
        expect(error.message).toEqual(expect.stringContaining('Unable to save blob'));
        expect(error.message).toEqual(expect.stringContaining('permission denied'));
        expect(error.message).toEqual(expect.stringContaining('open'));
    }
});
