# Quickstart: Drizzle ORM Integration with Better Auth

This quickstart guide outlines the essential steps to get the `better_auth_service` running with Drizzle ORM and a PostgreSQL database (like Neon DB).

## Prerequisites

*   Node.js (LTS version)
*   npm (Node Package Manager)
*   Docker (recommended for local PostgreSQL or Qdrant)
*   Access to a PostgreSQL database (e.g., Neon DB connection string)

## Setup Steps

1.  **Navigate to the `better_auth_service` directory:**
    ```bash
    cd chatbot-backend/better_auth_service
    ```

2.  **Install Dependencies:**
    Install core Drizzle ORM, PostgreSQL driver, `better-auth`, and its Drizzle adapter, along with dev dependencies for Drizzle Kit and `better-auth/cli`.
    ```bash
    npm install drizzle-orm postgres better-auth @better-auth/drizzle-adapter
    npm install -D drizzle-kit @better-auth/cli
    ```

3.  **Configure Environment Variables:**
    Ensure your shared `.env` file (located at `chatbot-backend/.env`) contains the `NEON_DATABASE_URL` for your PostgreSQL database (e.g., from Neon DB) and `BETTER_AUTH_SECRET`.
    ```dotenv
    NEON_DATABASE_URL="postgresql://user:password@host:port/database"
    BETTER_AUTH_SECRET="your_strong_random_secret_key"
    ```

4.  **Create Drizzle ORM Configuration:**
    Create the `drizzle.config.ts` file in the `chatbot-backend/better_auth_service/` directory.
    ```typescript
    // drizzle.config.ts
    import 'dotenv/config';
    import { defineConfig } from 'drizzle-kit';

    export default defineConfig({
      schema: './db/schema.ts', // Path to your Drizzle schema file
      out: './drizzle', // Directory for generated migrations
      dialect: 'postgresql',
      dbCredentials: {
        url: process.env.NEON_DATABASE_URL!,
      },
      verbose: true,
      strict: true,
    });
    ```

5.  **Create Drizzle Schema and DB Client:**
    Create a `db/` directory and within it, `db/index.ts` and `db/schema.ts`.
    *   **`db/index.ts` (Drizzle ORM connection for PostgreSQL):**
        ```typescript
        // db/index.ts
        import { drizzle } from 'drizzle-orm/postgres-js';
        import postgres from 'postgres';
        import * as schema from './schema'; // Your Drizzle schema definitions

        const queryClient = postgres(process.env.NEON_DATABASE_URL!);
        export const db = drizzle(queryClient, { schema });
        ```
    *   **`db/schema.ts` (Placeholder - will be generated/updated by CLI):**
        ```typescript
        // db/schema.ts
        // This file will be populated by 'npx @better-auth/cli generate'
        // and 'npx drizzle-kit generate'
        ```

6.  **Generate `better-auth` Schema:**
    Use the `better-auth` CLI to generate the authentication-specific schema into your `db/schema.ts` file.
    ```bash
    npx @better-auth/cli@latest generate
    ```

7.  **Generate and Apply Migrations:**
    Create Drizzle migration files and apply them to your Neon DB.
    ```bash
    npx drizzle-kit generate
    npx drizzle-kit migrate
    ```

8.  **Update `src/index.ts` for Better Auth Integration:**
    Modify `src/index.ts` to use the Drizzle adapter and the Drizzle DB instance.
    ```typescript
    // src/index.ts (excerpt)
    import { betterAuth } from 'better-auth';
    import { drizzleAdapter } from '@better-auth/drizzle-adapter'; // New import
    import { db } from './db'; // New import for your Drizzle ORM instance
    // ... other imports

    // ... dotenv.config({ path: '../.env' });

    export const auth = betterAuth({
      secret: process.env.BETTER_AUTH_SECRET,
      plugins: [
        // ... username plugin
      ],
      database: drizzleAdapter(db, { provider: 'pg' }), // Configure Drizzle adapter
      // ... other configurations
    });
    ```

9.  **Start the `better_auth_service`:**
    ```bash
    node_modules\.bin\ts-node src/index.ts
    ```

These steps will configure your `better_auth_service` to use a persistent PostgreSQL database, resolving the issue of lost user data.
