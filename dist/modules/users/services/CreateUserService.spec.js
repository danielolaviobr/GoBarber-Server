"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _CreateUserService = _interopRequireDefault(require("./CreateUserService"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeHashProvider;
let fakeCacheProvider;
let createUser;
describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    createUser = new _CreateUserService.default(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
  });
  it('shoud be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'test',
      email: 'test@example.com',
      password: 'password'
    });
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@example.com');
  });
  it('should not be able to create user with same email', async () => {
    await createUser.execute({
      name: 'test',
      email: 'test@example.com',
      password: 'password'
    });
    await expect(createUser.execute({
      name: 'test',
      email: 'test@example.com',
      password: 'password'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});