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

export async function getUserByEmailAndPassword(email: string, password: string) {
    const query = `
        SELECT id, name, email, birth_date, password, ranking
        FROM users
        WHERE LOWER(email) = LOWER($1);
    `;

    try {
        const result = await pool.query(query, [email]); 

        if (result.rows.length === 0) {
            return null;
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return null; 
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;

    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        throw new Error('Não foi possível buscar o usuário.');
    }
}

export async function getUserByEmail(email: string) {
    const query = `
        SELECT id, name, email, birth_date, ranking
        FROM users
        WHERE LOWER(email) = LOWER($1);
    `;

    try {
        const result = await pool.query(query, [email]); 

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0];

    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        throw new Error('Não foi possível buscar o usuário.');
    }
}

export async function getUserByNameOrEmail(nameOrEmail: string) {
    const query = `
        SELECT id, name, email, birth_date, ranking
        FROM users
        WHERE (LOWER(name) LIKE LOWER($1) or LOWER(email) LIKE LOWER($1));
    `;

    try {
        const result = await pool.query(query, [`%${nameOrEmail}%`]);
        
        if (result.rows.length === 0) {
            return null;
        }

        return result.rows;

    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        throw new Error('Não foi possível buscar o usuário.');
    }
}

export async function updateUser(user: UserModelUpdate) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (user.name !== undefined) {
        updates.push(`name = $${paramCount++}`);
        values.push(user.name);
    }

    if (user.email !== undefined) {
        updates.push(`email = $${paramCount++}`);
        values.push(user.email);
    }

    if (user.birthDate !== undefined) {
        updates.push(`birth_date = $${paramCount++}`);
        values.push(new Date(user.birthDate));
    }

    if (user.password !== undefined) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        updates.push(`password = $${paramCount++}`);
        values.push(hashedPassword);
    }

    if (user.ranking !== undefined) {
        updates.push(`ranking = $${paramCount++}`);
        values.push(user.ranking);
    }

    if (updates.length === 0) {
        throw new Error('Nenhum campo para atualizar foi fornecido.');
    }

    values.push(user.id);

    const query = `
        UPDATE users 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramCount}
        RETURNING id, name, email, ranking, created_at, updated_at;
    `;

    try {
        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            throw new Error('Usuário não encontrado.');
        }

        return result.rows[0];

    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        if (error instanceof Error && error.message === 'Usuário não encontrado.') {
            throw error;
        }
        throw new Error('Não foi possível atualizar o usuário. O e-mail pode já estar em uso.');
    }
}