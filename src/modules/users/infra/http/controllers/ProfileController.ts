import { Request, Response } from 'express';

import { container } from 'tsyringe';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ userId });

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
      avatar: user.avatar,
    };

    return response.json(userWithoutPassword);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, password, oldPassword } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const userId = request.user.id;

    const user = await updateProfile.execute({
      userId,
      name,
      email,
      password,
      oldPassword,
    });

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
      avatar: user.avatar,
    };

    return response.json(userWithoutPassword);
  }
}
