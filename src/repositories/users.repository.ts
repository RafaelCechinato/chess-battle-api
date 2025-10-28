import pool from '../database';
import * as bcrypt from 'bcrypt';

export async function createUser(user: UserModel) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const formattedBirthDate = new Date(user.birthDate);
    const query = `
        INSERT INTO users (name, email, birth_date, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, ranking, created_at;
    `;

    const values = [
        user.name,
        user.email,
        formattedBirthDate,
        hashedPassword
    ];

    try {
        const result = await pool.query(query, values);
        
        return result.rows[0]; 

    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        throw new Error('Não foi possível salvar o usuário. O e-mail pode já estar em uso.');
    }
}