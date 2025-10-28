import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config(); 

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.DB_HOST_PORT || "5432", 10), 
});

pool.on('connect', () => {
    console.log('Conectado ao PostgreSQL!');
});

export default pool;