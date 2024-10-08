import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { startServer } from './server';
import { Database } from './core/db';

dotenv.config();

const app = express();

// Middleware configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Function to initialize and start the server
async function initializeAndStartServer() {
  // Initialize the database connection
  const database = new Database();
  await database.initDatabase();

  // Start the server with the created Express app
  startServer(app);
}

// Call the function to initialize and start the server
initializeAndStartServer().catch((err) => {
  console.error('Error initializing the server:', err);
  process.exit(1);
});
