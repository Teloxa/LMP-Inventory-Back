import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

if(!SECRET_KEY) {
  throw new Error('JWT_SECRET is not defined in the environment variables .env');
}

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

    if(!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };

export default authMiddleware;
