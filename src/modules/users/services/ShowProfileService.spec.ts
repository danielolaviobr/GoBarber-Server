import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });
  it('shoud be able to show profile', async () => {
    const user = await fakeUsersRepository.createUser({
      name: 'Test',
      email: 'test@example.com',
      password: 'password',
    });

    const userProfile = await showProfile.execute({ userId: user.id });

    expect(userProfile).toHaveProperty('id');
    expect(userProfile.email).toBe('test@example.com');
  });

  it('should not be able show user profile from non-existing user', async () => {
    await expect(
      showProfile.execute({
        userId: 'id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
