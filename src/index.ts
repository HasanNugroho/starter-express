import 'reflect-metadata';
import express, { NextFunction } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { startServer } from './server';
import { Database } from './configs/db';
import { errorHandler } from './middleware/errors.middleware';
import cors from 'cors';
import { options } from './common/cors';
import { securityMiddleware } from './middleware/security.middleware';
import helmet from 'helmet';

dotenv.config();

const app = express();
const database = new Database();

// Middleware configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cors
app.use(cors(options));

// Security
// app.use(helmet())
// app.use(securityMiddleware)

// Error handling
app.use(errorHandler);

// Function to initialize and start the server
async function initializeAndStartServer() {
  // Initialize the database connection
  const database = new Database();
  await database.initDatabase();

  // Start the server with the created Express app
  startServer(app);
}

process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await database.closeDatabaseConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down server...');
  await database.closeDatabaseConnection();
  process.exit(0);
});

// Call the function to initialize and start the server
initializeAndStartServer().catch((err) => {
  console.error('Error initializing the server:', err);
  process.exit(1);
});
