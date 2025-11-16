import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';

import routes from './routes/routes';
import cors from 'cors';
import pool from './database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
const allowedOrigins = [
  'http://localhost:57566', // Seu frontend local
];

app.use(cors({
  origin: (origin, callback) => {
    // if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    // } else {
    //   callback(new Error('Not allowed by CORS'));
    // }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

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
    