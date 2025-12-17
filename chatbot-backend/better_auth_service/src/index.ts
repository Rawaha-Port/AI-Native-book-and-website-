import express from 'express';
import { betterAuth } from 'better-auth';
import { emailAndPassword } from 'better-auth/plugins';

const app = express();
app.use(express.json());

// Initialize Better Auth
export const auth = betterAuth({
  plugins: [
    emailAndPassword({
      // You can add options here if needed, e.g., password complexity
    }),
  ],
  // You would configure your database adapter here if better-auth needed to
  // directly manage users. For our use case, we are treating it as an
  // authentication provider and our Python backend manages user persistence.
  // We'll use the API methods to verify credentials and then our Python
  // backend will create the user record in Neon.
});

// Create an Express router for the auth endpoints
const authRouter = auth.api.router();

app.use('/auth', authRouter);

const PORT = process.env.BETTER_AUTH_PORT || 4000;

app.listen(PORT, () => {
  console.log(`Better Auth service running on http://localhost:${PORT}`);
});
