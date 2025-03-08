import fs from 'fs';
import path from 'path';

// Fungsi untuk membuat file baru dengan konten tertentu
const createFile = (filePath: string, content: string) => {
  try {
    fs.writeFileSync(filePath, content, { flag: 'w' });
    console.log(`File created: ${filePath}`);
  } catch (error) {
    console.error(`Error creating file: ${filePath}`, error);
  }
};

// Fungsi utama untuk menghasilkan module baru
const generateModule = (moduleName: string) => {
  const basePath = path.join(__dirname, 'src');
  const className = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

  // 
  // ENTITY
  // 

  // 1. Konten untuk file ${moduleName}.entity.ts (Entity untuk TypeORM)
  const entityPath = path.join(basePath, 'entities', `${moduleName}.entity.ts`)
  if (fs.existsSync(entityPath)) {
    console.log(`Entity '${moduleName}' already exists.`);
    return;
  }

  const entityContent = `import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity({ name: '${moduleName}' })
export class ${className} {
  @PrimaryColumn('char', { length: 36 })
  id: string = uuidv7();

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
`;
  createFile(entityPath, entityContent);

  // 
  // RESOLVER
  // 

  // 2. Konten untuk file ${moduleName}.resolver.ts (resolver untuk menangani request graphql)
  const resolverPath = path.join(basePath, 'graph', 'resolvers', `${moduleName}.resolver.ts`)
  if (fs.existsSync(resolverPath)) {
    console.log(`Resolver '${moduleName}' already exists.`);
    return;
  }

  const resolverContent = `import 'reflect-metadata';
import { ${className}Service } from '../../services/${moduleName}.service';
import { container } from 'tsyringe';
import { validator } from '../../common/pipes/validation.pipe';
import { BadRequestError, CustomError, ServerError } from '../../common/errors';

const ${moduleName}Service = container.resolve(${className}Service);

const ${moduleName}Resolvers = {
  Query: {
    ${moduleName}s: () => {
      return {};
    },
  },
  Mutation: {
    ${moduleName}: () => {
      return {};
    },
  },
  ${className}Query: {
    list() {
      return {};
    }
    // your code
  },
  ${className}Mutation: {
    create() {
      return {};
    }
    // your code
  }
};

export default ${moduleName}Resolvers;`;
  createFile(resolverPath, resolverContent);

  // 
  // SCHEMA
  // 

  // 3. Konten untuk file ${moduleName}-schema.graphql (resolver untuk menangani skema graphql)
  const schemaPath = path.join(basePath, 'graph', 'schema', `${moduleName}-schema.graphql`)
  // Memeriksa apakah folder module sudah ada
  if (fs.existsSync(schemaPath)) {
    console.log(`Schema '${moduleName}' already exists.`);
    return;
  }

  const schemaContent = `# ===============================================
# ${String(moduleName).toUpperCase()}
# ===============================================

type Query @rateLimit(limit: 60, duration: 60) {
  ${moduleName}s: ${className}Query
}

type Mutation {
  ${moduleName}: ${className}Mutation
}

# -----------------------------------------------
# QUERIES
# -----------------------------------------------

type ${className}Query {
  list(search: String, page: Int, limit: Int): ${className}ListResponse
}

# -----------------------------------------------
# MUTATIONS
# -----------------------------------------------

type ${className}Mutation {
  create(
    # Kolom yang diperlukan untuk create
    value: String!
  ): ${className}Response
}

# -----------------------------------------------
# RESPONSES
# -----------------------------------------------

type ${className}ListResponse {
  data: [${className}Minimal]
  pagination: PaginationInfo
}

type ${className}Response {
  responseResult: ResponseStatus
  ${moduleName}: ${className}Minimal
}

# -----------------------------------------------
# TYPES
# -----------------------------------------------

type ${className}Minimal {
  value: String!
}`;
  createFile(schemaPath, schemaContent);

  // 
  // SERVICE
  // 

  // 4. Konten untuk file ${moduleName}.service.ts (service untuk menangani logic bisnis)
  const servicePath = path.join(basePath, 'services', `${moduleName}.service.ts`)
  if (fs.existsSync(servicePath)) {
    console.log(`service '${moduleName}' already exists.`);
    return;
  }
  const serviceContent = `import { ${className}Dao } from '../dao/${moduleName}s.dao';
import { ${className} } from '../entities/${moduleName}.entity';
import { inject, injectable } from 'tsyringe';
import { BadRequestError, NotFoundException } from '../common/errors';
import { generatePagination } from '../common/pagination';

@injectable()
export class ${className}Service {
  constructor(@inject(${className}Dao) private ${moduleName}Dao: ${className}Dao) { }

  // your code
}`;
  createFile(servicePath, serviceContent);

  // 
  // DAO
  // 

  // 5. Konten untuk file ${moduleName}.dao.ts (Dao untuk TypeORM)
  const daoPath = path.join(basePath, 'dao', `${moduleName}s.dao.ts`)
  if (fs.existsSync(daoPath)) {
    console.log(`Dao '${moduleName}' already exists.`);
    return;
  }

  const daoContent = `import { ${className} } from '../entities/${moduleName}.entity';
import { Repository } from 'typeorm';
import dataSourceConfig from '../db/data-source';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export class ${className}Dao {
  private ${moduleName}Repository: Repository<${className}>;

  constructor() {
    this.${moduleName}Repository = dataSourceConfig.getRepository(${className});
  }

  // your code
}`;
  createFile(daoPath, daoContent);

}

// Ambil nama module dari argumen
const _moduleName = process.argv[2];

if (!_moduleName) {
  console.error('Please provide a module name.');
  process.exit(1);
}
generateModule(_moduleName)