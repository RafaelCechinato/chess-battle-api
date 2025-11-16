import { Router } from 'express';
import { authenticate } from '../utils/authMiddleware';
import { GamesController } from '../controllers/games.controller';

const router = Router();
const gamesController = new GamesController();

router.post('/newGame', authenticate, gamesController.createGame);


export default router;