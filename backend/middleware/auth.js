import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id and email
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;