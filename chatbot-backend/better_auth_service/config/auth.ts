// chatbot-backend/better_auth_service/config/auth.ts
import { betterAuth } from 'better-auth';
import { username } from 'better-auth/plugins/username';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db'; // Adjust path as needed

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [
    username({
      // You can add options here if needed, e.g., password complexity
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, { provider: 'pg' }), // Configure Drizzle adapter
  // ... other configurations
});
