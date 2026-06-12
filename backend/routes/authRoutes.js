import express from 'express';
import { register, login, getMe, updateBudget } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/budget', auth, updateBudget);

export default router;
