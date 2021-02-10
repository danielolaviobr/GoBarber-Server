import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpPath = path.resolve(__dirname, '..', '..', 'tmp');
const uploadsPath = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');

interface IUploadConfig {
  driver: 's3' | 'disk';
  tmpDirectory: string;
  uploadsDirectory: string;
  config: { aws: { bucket: string } };
  multer: { storage: StorageEngine };
}

export default {
  driver: process.env.STORAGE_DRIVER,
  tmpDirectory: tmpPath,
  uploadsDirectory: uploadsPath,
  multer: {
    storage: multer.diskStorage({
      destination: tmpPath,
      filename(request, file, callback) {
        const filehash = crypto.randomBytes(10).toString('hex');
        const filename = `${filehash}-${file.originalname}`;

        return callback(null, filename);
      },
    }),
  },

  config: {
    aws: { bucket: 'app-gobarber-daniel' },
  },
} as IUploadConfig;
