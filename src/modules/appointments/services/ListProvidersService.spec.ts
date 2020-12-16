import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });
  it('should be able to ist the providers', async () => {
    const loggedUser = await fakeUsersRepository.createUser({
      name: 'Test',
      email: 'test@example.com',
      password: 'password',
    });

    const providerUser1 = await fakeUsersRepository.createUser({
      name: 'Test1',
      email: 'test1@example.com',
      password: 'password',
    });

    const providerUser2 = await fakeUsersRepository.createUser({
      name: 'Test2',
      email: 'test2@example.com',
      password: 'password',
    });

    const providerUser3 = await fakeUsersRepository.createUser({
      name: 'Test3',
      email: 'test3@example.com',
      password: 'password',
    });

    const providers = await listProviders.execute({ userId: loggedUser.id });

    expect(providers).toEqual([providerUser1, providerUser2, providerUser3]);
  });
});
