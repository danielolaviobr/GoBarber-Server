import { v4 as uuid } from 'uuid';

import User from '@modules/users/infra/typeorm/entities/User';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import AppError from '@shared/errors/AppError';
import IUserTokensRepository from '../IUserTokensRepository';

export default class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const foundUserToken = this.userTokens.find(
      (userToken: UserToken) => userToken.token === token,
    );

    return foundUserToken;
  }
}
