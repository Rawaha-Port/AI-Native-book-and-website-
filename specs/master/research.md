# Research for Drizzle ORM and Better Auth Integration

## I. Performance Goals for Authentication (NEEDS CLARIFICATION)

**Research Task**: Identify typical performance goals for authentication operations (signin, signup) in web applications.

**Decision**: Authentication operations (signin/signup) should aim for a p95 latency of **under 200ms**. This ensures a responsive user experience.

**Rationale**: Industry standards for user-facing latency typically target sub-second response times, with critical actions often aiming for <300ms. Authentication, being a frequent and critical user interaction, benefits greatly from low latency.

**Alternatives Considered**:
*   No specific goal: Rejected due to potential for poor user experience.
*   More aggressive targets (<100ms): Deemed overly ambitious for initial implementation without specific requirements or profiling data.

## II. Testing Practices for better_auth_service (NEEDS CLARIFICATION)

**Research Task**: Research existing testing practices within the `better_auth_service` or similar Node.js projects in this repository to align with project conventions. If none, propose new ones.

**Decision**: Implement unit and integration tests for the `better_auth_service` using **Jest**.

**Rationale**:
*   `better_auth_service` is a TypeScript/Node.js project. Jest is a widely adopted testing framework for JavaScript/TypeScript, known for its ease of use, comprehensive features (assertions, mocking, coverage), and good integration with TypeScript.
*   No existing explicit testing framework was identified in the `better_auth_service` directory.
*   This aligns with the "Automated Checks" principle in the project constitution.

**Alternatives Considered**:
*   Mocha/Chai: Another popular option, but Jest offers an all-in-one solution that is often simpler to set up for new projects.
*   Leaving tests out: Rejected due to the critical nature of authentication and the "Automated Checks" constitutional principle.

## III. Drizzle ORM Integration Research

**Research Task**: Outline the steps and considerations for integrating Drizzle ORM with Better Auth for PostgreSQL (Neon DB).

**Decision**: Follow the `better-auth` documentation and examples to:
1.  Install Drizzle ORM, `postgres` driver, `better-auth`, and `@better-auth/drizzle-adapter`.
2.  Define Drizzle schema for `better-auth` entities (Users, Accounts, Sessions, etc.) using `pgTable`.
3.  Configure Drizzle ORM connection using `drizzle(queryClient, { schema })`.
4.  Configure `drizzle-kit` for migrations (`drizzle.config.ts`).
5.  Migrate the database using `npx drizzle-kit generate` and `npx drizzle-kit migrate`.
6.  Pass the Drizzle ORM instance to `betterAuth` via `database: drizzleAdapter(db)`.

**Rationale**: This approach leverages the official `better-auth` adapter for Drizzle, ensuring compatibility and adhering to recommended patterns for persistent storage.

**Alternatives Considered**:
*   Using Prisma: While a viable ORM, Drizzle ORM was explicitly mentioned in the `better-auth` examples and seems to have direct adapter support.
*   Using raw SQL/pg client: Rejected for increased complexity and reduced type safety compared to an ORM.
*   Using a different adapter (e.g., TypeORM): Rejected due to lack of direct `better-auth` adapter mention in initial research.

## IV. Better Auth Secret and Dotenv Configuration

**Research Task**: Ensure `better_auth_service` correctly loads `BETTER_AUTH_SECRET` and `NEON_DATABASE_URL` from the shared `.env` file.

**Decision**:
1.  Confirm `dotenv` is installed in `better_auth_service`.
2.  Ensure `src/index.ts` has `dotenv.config({ path: '../.env' });` at the top.
3.  Ensure `betterAuth` config includes `secret: process.env.BETTER_AUTH_SECRET,`.
4.  Ensure Drizzle ORM connection uses `process.env.NEON_DATABASE_URL`.

**Rationale**: This ensures both the Node.js and Python services correctly access shared environment variables and maintain consistency.

**Alternatives Considered**:
*   Duplicating `.env` files: Rejected to avoid configuration drift and maintain a single source of truth for environment variables.
*   Passing env vars via command line: Rejected for complexity and security concerns.
