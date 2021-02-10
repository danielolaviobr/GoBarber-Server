"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeStorageProvider = _interopRequireDefault(require("../../../shared/container/providers/StorageProvider/fakes/FakeStorageProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _UpdateUserAvatarService = _interopRequireDefault(require("./UpdateUserAvatarService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeStorageProvider;
let updateUserAvatar;
describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeStorageProvider = new _FakeStorageProvider.default();
    updateUserAvatar = new _UpdateUserAvatarService.default(fakeUsersRepository, fakeStorageProvider);
  });
  it('shoud be able to update users avatar', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'test',
      email: 'test@example.com',
      password: 'password'
    });
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'test_avatar.png'
    });
    expect(user.avatar).toBe('test_avatar.png');
  });
  it('shoud not be able to update avatar from non existing user', async () => {
    await expect(updateUserAvatar.execute({
      user_id: 'invalid_test_id',
      avatarFileName: 'test_avatar.png'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('shoud be able to delete old avatar when updating to new', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const user = await fakeUsersRepository.createUser({
      name: 'test',
      email: 'test@example.com',
      password: 'password'
    });
    user.avatar = 'not_correct_avatar.png';
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'test_avatar.png'
    });
    expect(deleteFile).toHaveBeenCalledWith('not_correct_avatar.png');
    expect(user.avatar).toBe('test_avatar.png');
  });
});