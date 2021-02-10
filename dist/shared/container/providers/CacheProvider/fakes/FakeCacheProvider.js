"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class FakeCacheProvider {
  constructor() {
    this.cacheData = {};
  }

  async save(key, value) {
    this.cacheData[key] = JSON.stringify(value);
  }

  async recover(key) {
    const data = this.cacheData[key];

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data);
    return parsedData;
  }

  async invalidate(key) {
    delete this.cacheData[key];
  }

  async invalidatePrefix(prefix) {
    const keys = Object.keys(this.cacheData).filter(key => key.startsWith(`${prefix}:`));
    keys.forEach(key => {
      delete this.cacheData[key];
    });
  }

}

exports.default = FakeCacheProvider;