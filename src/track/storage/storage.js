import VError from 'verror';
import libFs from 'fs';
import libToBuffer from 'blob-to-buffer';
import makeDir from 'make-dir';
import path from 'path';
import pify from 'pify';

const fs = pify(libFs);
const toBuffer = pify(libToBuffer);

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function createTrackStorage(resolveUrl) {
    async function saveBlob(blob) {
        // TODO Hack, Generate proper id
        const id = rand(1,9999999999999);
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
