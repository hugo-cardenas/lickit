import VError from 'verror';
import libFs from 'fs';
import libToBuffer from 'blob-to-buffer';
import makeDir from 'make-dir';
import path from 'path';
import pify from 'pify';
import cuid from 'cuid';

const fs = pify(libFs);
const toBuffer = pify(libToBuffer);

export default function createTrackStorage(resolvePath) {
  async function saveBlob(blob) {
    const id = cuid();
    try {
      const buffer = await toBuffer(blob);
      const path = resolvePath(id);
      await saveBuffer(path, buffer);
    } catch (error) {
      throw new VError(error, 'Unable to save blob');
    }
    return id;
  }

  async function deleteTrack(id) {
    const path = resolvePath(id);
    try {
      await fs.unlink(path);
    } catch (error) {
      throw new VError(error, 'Unable to delete track with id %s', id);
    }
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

  return { saveBlob, deleteTrack };
}
