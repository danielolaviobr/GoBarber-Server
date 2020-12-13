import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });
  it('shoud be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'test',
      email: 'test@example.com',
      password: 'password',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@example.com');
  });

  it('should not be able to create user with same email', async () => {
    await createUser.execute({
      name: 'test',
      email: 'test@example.com',
      password: 'password',
    });

    await expect(
      createUser.execute({
        name: 'test',
        email: 'test@example.com',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
