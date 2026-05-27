import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

if(!SECRET_KEY) {
  throw new Error('JWT_SECRET is not defined in the environment variables .env');
}

const authMiddleware = (req, res, next) => {
  const token = req.status(401).json({
    
  })
