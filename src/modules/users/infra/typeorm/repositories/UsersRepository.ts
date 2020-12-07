import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import { getRepository, Repository } from 'typeorm';
import ICreateUserDTO from '@modules/users/dtos/iCreateUserDTO';

export default class UsersRepository implements IUsersRepository {
  ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findOneByEmail(email: string): Promise<User | undefined> {
    const foundUser = await this.ormRepository.findOne({ where: { email } });
    return foundUser;
  }

  public async findOneByID(id: string): Promise<User | undefined> {
    const foundUser = await this.ormRepository.findOne(id);
    return foundUser;
  }

  public async createUser(userData: ICreateUserDTO): Promise<User> {
    const newUser = this.ormRepository.create(userData);

    await this.ormRepository.save(newUser);

    return newUser;
  }

  public async saveUser(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}
