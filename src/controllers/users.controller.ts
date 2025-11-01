import { Request, Response } from 'express';
import { errorHandler, errorHandlerElementNotFound } from '../handler/error.handler';
import { createUser, updateUser, getUserByNameOrEmail, getUserByEmail } from '../repositories/users.repository';

export class UsersController {

  async createUser(req: Request, res: Response) {
    try {
       const { name, email, password, birthDate } = req.body;
      const newUser = await createUser({name,email,password, birthDate});
      return res.status(201).json(newUser);
    } catch (e) {
      return errorHandler(e, res, "Erro ao criar usuário: ");
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
       const { name, email, password, birthDate, ranking, id } = req.body;
      const user = await updateUser({id, name,email,password, birthDate, ranking});
      if(user === null){
        return errorHandlerElementNotFound(res, "Usuário não encontrado");
      }
      return  res.status(200).json(user);
    } catch (e) {
      return errorHandler(e, res, "Erro ao criar usuário: ");
    }
  }

  async getUserByNameOrEmail(req: Request, res: Response) {
    try {
      const { nameOrEmail } = req.params;
      const newUser = await getUserByNameOrEmail(nameOrEmail);

      if(newUser === null){
        return errorHandlerElementNotFound(res, "Usuário não encontrado");
      }
      return res.status(200).json(newUser);
    } catch (e) {
      return errorHandler(e, res, "Erro ao buscar usuário: ");
    }
  }

  async getUserByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const newUser = await getUserByEmail(email);
      
      if(newUser === null){
        return errorHandlerElementNotFound(res, "Usuário não encontrado");
      }
      return res.status(200).json(newUser);
    } catch (e) {
      return errorHandler(e, res, "Erro ao buscar usuário: ");
    }
  }
}