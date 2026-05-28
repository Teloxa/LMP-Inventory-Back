import models from "../models/index.js"
import admin from "../config/connection.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const SECRET_KEY = process.env.JWT_SECRET

if(!SECRET_KEY) {
  throw new Error('The key JWT_SECRET is not define on the file .env');
}

const TOKEN_EXPIRATION = '1h';

export default {
  add: async (req, res) => {
    try {
      const findUser = await admin.firestore().collection('users').where('user', '==', req.body.user).get();
      const findEmail = await admin.firestore().collection('users').where('email', '==', req.body.email).get();

      if(!findUser.empty) {
        return res.status(400).json({
          error: 'The username is already taken'
        });
      }

      if(!findEmail.empty) {
        return res.status(400).json({
          error: 'The email is already taken'
        });
      }
      
      req.body.password = await bcrypt.hash(req.body.password, 10);

      const newUser = {
        ...models.userModel,
        ...req.body
      };

      const userRef = admin.firestore().collection('users').doc();
      await userRef.set(newUser);

      res.status(200).json({id: userRef.id, ...newUser});
    } catch(e) {
      console.error(e);
      res.status(500).json({
        message: 'An erro occurred while adding the user',
        error: e.message
      });
    }
  },
  list: async (req, res) => {
    try {
      const snapshot = await admin.firestore().collection('users').get()
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.status(200).json(users);
    } catch(e) {
      console.error(e);
      res.status(500).json({
        message: 'An error occurred while getting the list of users',
        error: e.message
      });

    }
  }
}


// - findById(id): Fetch a single user profile.
// - listAll(): Retrieve all users (consider adding pagination later).
// - update(id, data): Modify existing user details.
// - delete(id): Remove a user from the system.