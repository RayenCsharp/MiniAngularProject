import { Router } from 'express';
import { login, changePassword } from '../Controllers/adminController.js';

const router = Router();
router.post('/login', login);
router.patch('/:id/password', changePassword);

export default router;