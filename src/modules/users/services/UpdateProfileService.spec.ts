import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('shoud be able to update the profile', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'Test',
      email: 'test@example.com',
      password: 'password',
    });

    const updatedUser = await updateProfile.execute({
      userId: user.id,
      name: 'New Test',
      email: 'newtest@example.com',
    });

    expect(updatedUser.name).toBe('New Test');
    expect(updatedUser.email).toBe('newtest@example.com');
  });

  it('should not be able to update email to another user email', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'Test',
      email: 'test1@example.com',
      password: 'password',
    });

    await fakeUsersRepository.createUser({
      name: 'Test',
      email: 'test2@example.com',
      password: 'password',
    });

    await expect(
      updateProfile.execute({
        userId: user.id,
        name: 'New Test',
        email: 'test2@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'Test',
      email: 'test1@example.com',
      password: 'password',
    });

    const updatedUser = await updateProfile.execute({
      userId: user.id,
      name: 'New Test',
      email: 'newtest@example.com',
      password: 'newPassword',
      oldPassword: 'password',
    });

    expect(updatedUser.password).toBe('newPassword');
  });

  it('should not be able to update the password without oldPassword', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'Test',
      email: 'test1@example.com',
      password: 'password',
    });

    await expect(
      updateProfile.execute({
        userId: user.id,
        name: 'New Test',
        email: 'newtest@example.com',
        password: 'newPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with incorrect oldPassword', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'Test',
      email: 'test1@example.com',
      password: 'password',
    });

    await expect(
      updateProfile.execute({
        userId: user.id,
        name: 'New Test',
        email: 'newtest@example.com',
        password: 'newPassword',
        oldPassword: 'wrongPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a non-existing user', async () => {
    await expect(
      updateProfile.execute({
        userId: 'id',
        name: 'New Test',
        email: 'newtest@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
