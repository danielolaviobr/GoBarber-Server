"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _AuthenticateUserService = _interopRequireDefault(require("./AuthenticateUserService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeHashProvider;
let authenticateUser;
describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    authenticateUser = new _AuthenticateUserService.default(fakeUsersRepository, fakeHashProvider);
  });
  it('shoud not be able to authenticate user that the email is not registered', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'test',
      email: 'test@example.com',
      password: 'password'
    });
    const response = await authenticateUser.execute({
      email: 'test@example.com',
      password: 'password'
    });
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });
  it('should not be able to authenticate with invalid password', async () => {
    await fakeUsersRepository.createUser({
      name: 'test',
      email: 'test@example.com',
      password: 'password'
    });
    await expect(authenticateUser.execute({
      email: 'test@example.com',
      password: 'wrong-password'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to authenticate with non existing user', async () => {
    await expect(authenticateUser.execute({
      email: 'test@example.com',
      password: 'password'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});