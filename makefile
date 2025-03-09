.PHONY: migration-create migration-generate migration-show migration-run migration-revert

# Path to the TypeORM data source
DATASOURCE=./src/db/data-source.ts

# Manually create a new migration with a specified name
migration-create:
	@if [ -z "$(name)" ]; then \
		echo "❌ ERROR: Please provide a migration name using 'make migration-create name=MIGRATION_NAME'"; \
		exit 1; \
	fi
	npx typeorm migration:create ./src/db/migrations/${name}

# Automatically generate a migration from entity changes
migration-generate:
	npx typeorm-ts-node-commonjs migration:generate ./src/db/migrations/schema-update -d $(DATASOURCE)

# Show the list of pending migrations
migration-show:
	npx typeorm-ts-node-commonjs migration:show -d $(DATASOURCE)

# Apply all pending migrations to the database
migration-run:
	npx typeorm-ts-node-commonjs migration:run -d $(DATASOURCE)

# Revert the last applied migration
migration-revert:
	npx typeorm-ts-node-commonjs migration:revert -d $(DATASOURCE)
