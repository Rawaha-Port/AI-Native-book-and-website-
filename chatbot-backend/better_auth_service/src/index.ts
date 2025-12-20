import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import dotenv from 'dotenv';
import { auth } from '../config/auth'; // Corrected import for auth configuration


// Load .env file from the parent directory
dotenv.config({ path: '../.env' });

const app = express();
app.use(express.json());

// Create an Express router for the auth endpoints
app.use('/auth', toNodeHandler(auth));

const PORT = process.env.BETTER_AUTH_PORT || 4000;

app.listen(PORT, () => {
  console.log(`Better Auth service running on http://localhost:${PORT}`);
});
