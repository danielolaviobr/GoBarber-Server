import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/iCreateUserDTO';
import IFindAllProvidersDTO from '@modules/appointments/dtos/iFindAllProvidersDTO';

export default interface IUserRepository {
  findOneByEmail(email: string): Promise<User | undefined>;
  findOneByID(id: string): Promise<User | undefined>;
  createUser(userData: ICreateUserDTO): Promise<User>;
  saveUser(user: User): Promise<User>;
  findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>;
}
