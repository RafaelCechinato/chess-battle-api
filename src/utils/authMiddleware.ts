import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// Estende o tipo Request para incluir o user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
            };
        }
    }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ 
                message: 'Token não fornecido' 
            });
        }

        const parts = authHeader.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ 
                message: 'Formato de token inválido' 
            });
        }
        

        const token = parts[1];
        const decoded = verifyToken(token);
        
        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        next();

    } catch (error) {
        return res.status(401).json({ 
            message: 'Token inválido ou expirado' 
        });
    }
}