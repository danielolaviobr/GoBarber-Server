"use strict";

var _FakeUsersRepository = _interopRequireDefault(require("../../users/repositories/fakes/FakeUsersRepository"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _ListProvidersService = _interopRequireDefault(require("./ListProvidersService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let listProviders;
let fakeCacheProvider;
describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    listProviders = new _ListProvidersService.default(fakeUsersRepository, fakeCacheProvider);
  });
  it('should be able to ist the providers', async () => {
    const loggedUser = await fakeUsersRepository.createUser({
      name: 'Test',
      email: 'test@example.com',
      password: 'password'
    });
    const providerUser1 = await fakeUsersRepository.createUser({
      name: 'Test1',
      email: 'test1@example.com',
      password: 'password'
    });
    const providerUser2 = await fakeUsersRepository.createUser({
      name: 'Test2',
      email: 'test2@example.com',
      password: 'password'
    });
    const providerUser3 = await fakeUsersRepository.createUser({
      name: 'Test3',
      email: 'test3@example.com',
      password: 'password'
    });
    const providers = await listProviders.execute({
      userId: loggedUser.id
    });
    expect(providers).toEqual([providerUser1, providerUser2, providerUser3]);
  });
});