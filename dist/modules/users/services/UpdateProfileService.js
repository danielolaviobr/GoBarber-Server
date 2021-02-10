"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _IUsersRepository = _interopRequireDefault(require("../repositories/IUsersRepository"));

var _IHashProvider = _interopRequireDefault(require("../providers/HashProvider/models/IHashProvider"));

var _dec, _dec2, _dec3, _dec4, _dec5, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let UpdateProfile = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('UsersRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('HashProvider')(target, undefined, 1);
}, _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof _IUsersRepository.default === "undefined" ? Object : _IUsersRepository.default, typeof _IHashProvider.default === "undefined" ? Object : _IHashProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = class UpdateProfile {
  constructor(usersRepository, hashProvider) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  async execute({
    userId,
    name,
    email,
    password,
    oldPassword
  }) {
    const user = await this.usersRepository.findOneByID(userId);

    if (!user) {
      throw new _AppError.default('User not found');
    }

    const userEmailFound = await this.usersRepository.findOneByEmail(email);

    if (userEmailFound && userEmailFound.id !== user.id) {
      throw new _AppError.default('Can not update email to another user email');
    }

    if (password && !oldPassword) {
      throw new _AppError.default('The previous password must be provided to update the password');
    }

    if (password && oldPassword) {
      const passwordValidation = await this.hashProvider.compareHash(oldPassword, user.password);

      if (!passwordValidation) {
        throw new _AppError.default('The old password doest not match');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    user.name = name;
    user.email = email;
    return this.usersRepository.saveUser(user);
  }

}) || _class) || _class) || _class) || _class) || _class);
var _default = UpdateProfile;
exports.default = _default;