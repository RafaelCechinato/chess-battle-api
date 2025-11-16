import { Router } from 'express';
import usersRoutes from './users.routes';
import authRoutes from './auth.routes';
import gameRoutes from './game.routes';

const router = Router();

router.use('/users', usersRoutes);
router.use('/auth', authRoutes);
router.use('/game', gameRoutes);

export default router;