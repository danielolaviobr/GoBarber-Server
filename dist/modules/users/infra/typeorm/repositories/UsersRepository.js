"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _User = _interopRequireDefault(require("../entities/User"));

var _typeorm = require("typeorm");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UsersRepository {
  constructor() {
    this.ormRepository = void 0;
    this.ormRepository = (0, _typeorm.getRepository)(_User.default);
  }

  async findOneByEmail(email) {
    const foundUser = await this.ormRepository.findOne({
      where: {
        email
      }
    });
    return foundUser;
  }

  async findOneByID(id) {
    const foundUser = await this.ormRepository.findOne(id);
    return foundUser;
  }

  async findAllProviders({
    exceptUserId
  }) {
    let users;

    if (exceptUserId) {
      users = await this.ormRepository.find({
        where: {
          id: (0, _typeorm.Not)(exceptUserId)
        }
      });
    } else {
      users = await this.ormRepository.find();
    }

    return users;
  }

  async createUser(userData) {
    const newUser = this.ormRepository.create(userData);
    await this.ormRepository.save(newUser);
    return newUser;
  }

  async saveUser(user) {
    return this.ormRepository.save(user);
  }

}

exports.default = UsersRepository;