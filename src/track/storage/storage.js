import VError from 'verror';
import libFs from 'fs';
import libToBuffer from 'blob-to-buffer';
import makeDir from 'make-dir';
import path from 'path';
import pify from 'pify';

const fs = pify(libFs);
const toBuffer = pify(libToBuffer);

function createTrackStorage(resolveUrl) {

    async function saveBlob(blob) {
        // TODO Generate proper id
        const id = 42;
        try {
            const buffer = await toBuffer(blob);
            const path = resolveUrl(id);
            await saveBuffer(path, buffer);
        } catch (error) {
            throw new VError(error, 'Unable to save blob');
        }
        return id;
    }

    async function saveBuffer(trackPath, buffer) {
        try {
            await fs.writeFile(trackPath, buffer);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await makeDir(path.dirname(trackPath));
                await fs.writeFile(trackPath, buffer);
            } else {
                throw error;
            }
        }
    }

    return { saveBlob };
}

export default createTrackStorage;
