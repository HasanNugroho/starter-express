import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import dataSourceConfig from '../db/data-source';
import logger from './logger';

dotenv.config();
export class Database {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = dataSourceConfig;
  }

  async initDatabase(): Promise<void> {
    try {
      await this.dataSource.initialize();
      logger.info('Database connection established successfully.');
    } catch (error) {
      logger.error('Error initializing database connection:', error);
    }
  }
}
