import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  userId: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}

@injectable()
class UpdateProfile {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    userId,
    name,
    email,
    password,
    oldPassword,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findOneByID(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    const userEmailFound = await this.usersRepository.findOneByEmail(email);

    if (userEmailFound && userEmailFound.id !== user.id) {
      throw new AppError('Can not update email to another user email');
    }

    if (password && !oldPassword) {
      throw new AppError(
        'The previous password must be provided to update the password',
      );
    }

    if (password && oldPassword) {
      const passwordValidation = await this.hashProvider.compareHash(
        oldPassword,
        user.password,
      );

      if (!passwordValidation) {
        throw new AppError('The old password doest not match');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    user.name = name;
    user.email = email;

    return this.usersRepository.saveUser(user);
  }
}

export default UpdateProfile;
