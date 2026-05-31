import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import cors from 'cors'; // Import CORS middleware

dotenv.config();
const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.static('public')); // Middleware to serve static files
app.use(express.json()); // Middleware to parse JSON

app.use('/api', routes); // Prefix all routes with /api

// Port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);

});