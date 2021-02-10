"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _uuid = require("uuid");

var _User = _interopRequireDefault(require("../../infra/typeorm/entities/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FakeUsersRepository {
  constructor() {
    this.users = [];
  }

  async findOneByEmail(email) {
    const foundUser = this.users.find(user => user.email === email);
    return foundUser;
  }

  async findOneByID(id) {
    const foundUser = this.users.find(user => user.id === id);
    return foundUser;
  }

  async findAllProviders({
    exceptUserId
  }) {
    let {
      users
    } = this;

    if (exceptUserId) {
      users = users.filter(user => user.id !== exceptUserId);
    }

    return users;
  }

  async createUser(userData) {
    const newUser = new _User.default();
    Object.assign(newUser, {
      id: (0, _uuid.v4)(),
      ...userData
    });
    this.users.push(newUser);
    return newUser;
  }

  async saveUser(user) {
    const foundUserIndex = this.users.findIndex(userSearch => userSearch.id === user.id);
    this.users[foundUserIndex] = user;
    return user;
  }

}

exports.default = FakeUsersRepository;