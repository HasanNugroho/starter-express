# starter-express
Typescript backend template with express and graphql

## Tech Stack & Library
- ExpressJs : https://expressjs.com/
- Graphql : https://github.com/apollographql/apollo-server
- Redis : https://github.com/redis/redis
- Lodash : https://github.com/lodash/lodash
- Validator : https://github.com/typestack/class-validator
- Typeorm : https://github.com/typeorm/typeorm
- Winston : https://github.com/winstonjs/winston

### Development & Build
- `npm run dev` → Starts the server in development mode with hot-reloading.
- `npm run build` → Compiles TypeScript into JavaScript.
- `npm run start` → Runs the compiled server in production.

### Database Migrations (TypeORM)
- `make migration-create name=MIGRATION_NAME` → Creates a new empty migration file.
- `make migration-generate` → Generates a migration based on entity changes.
- `make migration-show` → Lists all pending migrations.
- `make migration-run` → Runs all pending migrations.
- `make migration-revert` → Reverts the last applied migration.

### Database Utilities
- `npm run schema:sync` → Syncs database schema directly from entities (not recommended for production).
- `npm run schema:drop` → Deletes all tables and data from the database.
- `npm run typeorm:cache` → Clears cached database queries.

### Code Formatting & Linting
- `npm run prettier` → Formats all TypeScript and JSON files.
  
### Other Utilities
- `npm run generate:module` → Creates a new module based on project structure.

This guide provides a **concise overview** of the most commonly used commands for **development, database migrations, and code formatting.** 🚀
