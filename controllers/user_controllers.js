import models from "../models/index.js"
import admin from "../config/connection.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const SECRET_KEY = process.env.JWT_SECRET

// TODO: Implement error handling for missing or invalid JWT_SECRET environment variable
// TODO: Ensure the application crashes gracefully or fallbacks safely if JWT config fails

// TODO: Implement User Service functions:
// - findByEmail(email): Search for a specific user by email.
// - findById(id): Fetch a single user profile.
// - listAll(): Retrieve all users (consider adding pagination later).
// - update(id, data): Modify existing user details.
// - delete(id): Remove a user from the system.