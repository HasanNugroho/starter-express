import { Database } from './core/db';
import { ApolloServerConfig } from './core/graph';
import express, { Express } from 'express';
import logger from './core/logger'; // Import the default logger instance

export const startServer = async (app: Express) => {
  try {
    // Start Apollo Server
    const serverConfig = new ApolloServerConfig();
    await serverConfig.start();

    // Start the Express app
    const port = Number(process.env.PORT) || 5000;
    const host = process.env.HOST || 'localhost';

    app.listen(port, () => {
      logger.info(`Server running at http://${host}:${port}`);
    });
  } catch (error) {
    logger.error('Error initializing server:', error);
    process.exit(1);
  }
};
