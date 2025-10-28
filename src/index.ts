import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/routes';

dotenv.config(); 

import pool from './database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);

pool.connect()
    .then(() => {
        console.log('✅ Conexão inicial com o DB estabelecida com sucesso!');
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`Acesse: http://localhost:${PORT}/api/`);
        });

    })
    .catch((err) => {
        console.error('❌ ERRO CRÍTICO: Falha ao conectar ao banco de dados.', err.message);
        process.exit(1); 
    });
    