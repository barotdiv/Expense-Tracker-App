import express from 'express';
import { createExpense, getExpenses, updateExpense, deleteExpense } from '../controllers/expenseController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);
router.get('/', getExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
