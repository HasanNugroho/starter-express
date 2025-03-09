import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import dataSourceConfig from '../database/data-source';
import logger from './logger';

dotenv.config();

export class Database {
  private dataSource: DataSource;
  private conAttempts = 0;
  private maxAttempts = 10;
  private retryDelay = 3000; // in milliseconds

  constructor() {
    this.dataSource = dataSourceConfig;
  }

  private async retryInitialization(): Promise<void> {
    if (this.conAttempts < this.maxAttempts) {
      this.conAttempts++;
      logger.warn(
        `Retrying database connection in ${this.retryDelay / 1000} seconds... [Attempt ${this.conAttempts} of ${this.maxAttempts}]`
      );
      await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
      await this.initDatabase();
    } else {
      logger.error('Max retry attempts reached. Exiting...');
      process.exit(1);
    }
  }

  async initDatabase(): Promise<void> {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
        logger.info('Database connection established successfully.');
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Database Connection Error: ${error.message}`);
        await this.retryInitialization();
      } else {
        logger.error('Unknown error during database initialization:', error);
        process.exit(1);
      }
    }
  }

  // Fungsi untuk menutup koneksi database
  async closeDatabaseConnection(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy(); // Menutup koneksi dengan benar
      logger.info('Database connection closed successfully.');
    }
  }
}
