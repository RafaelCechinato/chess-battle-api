import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '../interfaces/jwt.interface';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    if (!JWT_SECRET) {
        throw new Error('ERRO CRÍTICO: JWT_SECRET não definido no arquivo .env');
    }

    const secretKey: Secret = JWT_SECRET; 

    if (!JWT_EXPIRES_IN) {
        throw new Error('ERRO CRÍTICO: JWT_EXPIRES_IN não definido no arquivo .env');
    }
    
    const options: SignOptions = {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] 
    };

    return jwt.sign({...payload}, secretKey, options);
}
export function verifyToken(token: string): JwtPayload {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET não está definido');
    }
    
    console.log('Verificando token com secret:', JWT_SECRET); // DEBUG
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token expirado');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error(`Token inválido: ${error.message}`);
        }
        throw new Error('Erro ao verificar token');
    }
}

export function decodeToken(token: string): JwtPayload | null {
    try {
        const decoded = jwt.decode(token) as JwtPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}