"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _crypto = _interopRequireDefault(require("crypto"));

var _multer = _interopRequireDefault(require("multer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tmpPath = _path.default.resolve(__dirname, '..', '..', 'tmp');

const uploadsPath = _path.default.resolve(__dirname, '..', '..', 'tmp', 'uploads');

var _default = {
  driver: process.env.STORAGE_DRIVER,
  tmpDirectory: tmpPath,
  uploadsDirectory: uploadsPath,
  multer: {
    storage: _multer.default.diskStorage({
      destination: tmpPath,

      filename(request, file, callback) {
        const filehash = _crypto.default.randomBytes(10).toString('hex');

        const filename = `${filehash}-${file.originalname}`;
        return callback(null, filename);
      }

    })
  },
  config: {
    aws: {
      bucket: 'app-gobarber-daniel'
    }
  }
};
exports.default = _default;