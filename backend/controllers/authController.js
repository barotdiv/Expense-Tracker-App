import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key_here_spendwise', {
    expiresIn: '30d'
  });
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        budget: user.budget
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        budget: user.budget
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        budget: user.budget
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving user data', error: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { budget } = req.body;
    if (budget === undefined || isNaN(parseFloat(budget)) || parseFloat(budget) < 0) {
      return res.status(400).json({ message: 'Invalid budget amount' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.budget = parseFloat(budget);
    await user.save();

    return res.json({
      message: 'Budget updated successfully',
      budget: user.budget
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating budget', error: error.message });
  }
};
