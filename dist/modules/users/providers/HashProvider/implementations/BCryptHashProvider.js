"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcryptjs = require("bcryptjs");

class BCryptHashProvider {
  async generateHash(payload) {
    return (0, _bcryptjs.hash)(payload, 8);
  }

  async compareHash(payload, hashedPassword) {
    return (0, _bcryptjs.compare)(payload, hashedPassword);
  }

}

exports.default = BCryptHashProvider;