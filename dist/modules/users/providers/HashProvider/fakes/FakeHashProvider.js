"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class FakeHashProvider {
  async generateHash(payload) {
    return payload;
  }

  async compareHash(payload, hashedPassword) {
    return payload === hashedPassword;
  }

}

exports.default = FakeHashProvider;