import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });
  it('shoud be able to recover password using e-mail', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.createUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
    });

    await sendForgotPasswordEmail.execute({
      email: 'test@example.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recouver a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'test@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.createUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
    });

    await sendForgotPasswordEmail.execute({
      email: 'test@example.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
