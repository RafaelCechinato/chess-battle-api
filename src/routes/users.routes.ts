import { Router } from 'express';
import { authenticate } from '../utils/authMiddleware';
import { UsersController } from '../controllers/users.controller';

const router = Router();
const usersController = new UsersController();

router.get('/:nameOrEmail', authenticate, usersController.getUserByNameOrEmail);
router.get('/email/:email', usersController.getUserByEmail);
router.post('/', usersController.createUser);
router.put('/', usersController.updateUser);


export default router;