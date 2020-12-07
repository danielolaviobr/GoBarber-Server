import { v4 as uuid } from 'uuid';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/iCreateUserDTO';

export default class UsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findOneByEmail(email: string): Promise<User | undefined> {
    const foundUser = this.users.find((user: User) => user.email === email);
    return foundUser;
  }

  public async findOneByID(id: string): Promise<User | undefined> {
    const foundUser = this.users.find((user: User) => user.id === id);
    return foundUser;
  }

  public async createUser(userData: ICreateUserDTO): Promise<User> {
    const newUser = new User();

    Object.assign(newUser, { id: uuid(), ...userData });

    this.users.push(newUser);
    return newUser;
  }

  public async saveUser(user: User): Promise<User> {
    const foundUserIndex = this.users.findIndex(
      (userSearch: User) => userSearch.id === user.id,
    );

    this.users[foundUserIndex] = user;

    return user;
  }
}
