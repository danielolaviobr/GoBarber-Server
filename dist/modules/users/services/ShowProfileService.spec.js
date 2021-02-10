"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _ShowProfileService = _interopRequireDefault(require("./ShowProfileService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let showProfile;
describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    showProfile = new _ShowProfileService.default(fakeUsersRepository);
  });
  it('shoud be able to show profile', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'Test',
      email: 'test@example.com',
      password: 'password'
    });
    const userProfile = await showProfile.execute({
      userId: user.id
    });
    expect(userProfile).toHaveProperty('id');
    expect(userProfile.email).toBe('test@example.com');
  });
  it('should not be able show user profile from non-existing user', async () => {
    await expect(showProfile.execute({
      userId: 'id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});