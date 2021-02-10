"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _UpdateProfileService = _interopRequireDefault(require("./UpdateProfileService"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeHashProvider;
let updateProfile;
describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    updateProfile = new _UpdateProfileService.default(fakeUsersRepository, fakeHashProvider);
  });
  it('shoud be able to update the profile', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'Test',
      email: 'test@example.com',
      password: 'password'
    });
    const updatedUser = await updateProfile.execute({
      userId: user.id,
      name: 'New Test',
      email: 'newtest@example.com'
    });
    expect(updatedUser.name).toBe('New Test');
    expect(updatedUser.email).toBe('newtest@example.com');
  });
  it('should not be able to update email to another user email', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'Test',
      email: 'test1@example.com',
      password: 'password'
    });
    await fakeUsersRepository.createUser({
      name: 'Test',
      email: 'test2@example.com',
      password: 'password'
    });
    await expect(updateProfile.execute({
      userId: user.id,
      name: 'New Test',
      email: 'test2@example.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'Test',
      email: 'test1@example.com',
      password: 'password'
    });
    const updatedUser = await updateProfile.execute({
      userId: user.id,
      name: 'New Test',
      email: 'newtest@example.com',
      password: 'newPassword',
      oldPassword: 'password'
    });
    expect(updatedUser.password).toBe('newPassword');
  });
  it('should not be able to update the password without oldPassword', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'Test',
      email: 'test1@example.com',
      password: 'password'
    });
    await expect(updateProfile.execute({
      userId: user.id,
      name: 'New Test',
      email: 'newtest@example.com',
      password: 'newPassword'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to update the password with incorrect oldPassword', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'Test',
      email: 'test1@example.com',
      password: 'password'
    });
    await expect(updateProfile.execute({
      userId: user.id,
      name: 'New Test',
      email: 'newtest@example.com',
      password: 'newPassword',
      oldPassword: 'wrongPassword'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to update a non-existing user', async () => {
    await expect(updateProfile.execute({
      userId: 'id',
      name: 'New Test',
      email: 'newtest@example.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});