import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpPath = path.resolve(__dirname, '..', '..', 'tmp');
const uploadsPath = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');

export default {
  tmpDirectory: tmpPath,
  uploadsDirectory: uploadsPath,
  storage: multer.diskStorage({
    destination: tmpPath,
    filename(request, file, callback) {
      const filehash = crypto.randomBytes(10).toString('hex');
      const filename = `${filehash}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
