import { Request, Response } from 'express';
import { errorHandler } from '../handler/error.handler';
import { createUser } from '../repositories/users.repository';

export class UsersController {
  getUserById(req: Request, res: Response) {
    const { id } = req.params;
    res.json({ userId: id, name: 'Exemplo' });
  }

  async createUser(req: Request, res: Response) {
    try {
       const { name, email, password, birthDate } = req.body;
      const newUser = await createUser({name,email,password, birthDate});
      return res.status(201).json(newUser);
    } catch (e) {
      return errorHandler(e, res, "Erro ao criar usuário: ");
    }
  }
}