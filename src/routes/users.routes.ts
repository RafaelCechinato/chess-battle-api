import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';

const router = Router();
const usersController = new UsersController();

router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);

export default router;