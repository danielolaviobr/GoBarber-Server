import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('shoud be able to reset password', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({ password: 'newPassword', token });

    const updatedUser = await fakeUsersRepository.findOneByID(user.id);

    expect(updatedUser?.password).toBe('newPassword');
    expect(generateHash).toHaveBeenCalledWith('newPassword');
  });

  it('should not be able to reset password with non-existing token', async () => {
    await expect(
      resetPassword.execute({ token: 'fakeToken', password: 'fakePassword' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate('fakeUserID');

    await expect(
      resetPassword.execute({ token, password: 'fakePassword' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password 2 hours after token creation', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customHours = new Date();

      return customHours.setHours(customHours.getHours() + 3);
    });

    await expect(
      resetPassword.execute({ password: 'newPassword', token }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
