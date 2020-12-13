import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });
  it('shoud be able to update users avatar', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'test',
      email: 'test@example.com',
      password: 'password',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'test_avatar.png',
    });

    expect(user.avatar).toBe('test_avatar.png');
  });

  it('shoud not be able to update avatar from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'invalid_test_id',
        avatarFileName: 'test_avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shoud be able to delete old avatar when updating to new', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.createUser({
      name: 'test',
      email: 'test@example.com',
      password: 'password',
    });

    user.avatar = 'not_correct_avatar.png';

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'test_avatar.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('not_correct_avatar.png');
    expect(user.avatar).toBe('test_avatar.png');
  });
});
