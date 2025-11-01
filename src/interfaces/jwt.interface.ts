import { JwtPayload as JwtPayloadBase } from 'jsonwebtoken';

export interface JwtPayload extends JwtPayloadBase {
    id: number;
    email: string;
}