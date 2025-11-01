import { Request, Response } from 'express';
import { errorHandler, errorHandlerElementNotFound } from '../handler/error.handler';
import { getUserByEmailAndPassword } from '../repositories/users.repository';
import { generateToken } from '../utils/jwt';

export class AuthController {

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await getUserByEmailAndPassword(email, password);

            if(user === null){
                return errorHandlerElementNotFound(res, "Usuário não encontrado");
            }

            const token = generateToken({
                id: user.id,
                email: user.email
            });

            return res.status(200).json({
                message: 'Login realizado com sucesso',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    ranking: user.ranking
                },
                token
            });
        } catch (e) {
            return errorHandler(e, res, "Erro ao logar usuário: ");
        }
    }

}