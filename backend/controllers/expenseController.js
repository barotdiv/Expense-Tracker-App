import Expense from '../models/Expense.js';

export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const expense = await Expense.create({ title, amount, category, date, user: req.user.id });
    return res.status(201).json({ expense });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json({ expenses });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Not found' });
    if (expense.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    Object.assign(expense, req.body);
    await expense.save();
    return res.json({ expense });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Not found' });
    if (expense.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await expense.deleteOne();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
