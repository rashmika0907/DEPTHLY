import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
};

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  req.userId = decoded.userId;
  next();
};
