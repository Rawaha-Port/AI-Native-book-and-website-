import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema'; // Your Drizzle schema definitions

const queryClient = postgres(process.env.NEON_DATABASE_URL!);
export const db = drizzle(queryClient, { schema });
