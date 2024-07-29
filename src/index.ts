import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { startServer } from './server';

dotenv.config();

const app = express();

// Middleware configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Start the server with the created Express app
startServer(app);
