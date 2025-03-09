import { Express } from 'express';
import http from 'http';
import cors from 'cors';
import logger from './logger';
import bodyParser from 'body-parser';
import redisClient from './redis';
import schema from '../graph';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

// start service
export const startServer = async (app: Express) => {
  try {
    const port = Number(process.env.PORT) || 5000;
    const host = process.env.HOST ?? 'localhost';
    const isProduction = process.env.NODE_ENV === 'production';

    const httpServer = http.createServer(app);

    // Start GraphQL Server
    const server = new ApolloServer({
      schema: schema,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();

    // Allow GET health check in production
    if (isProduction) {
      app.get('/graphql', (_, res) => res.status(200).send('ok'));
    }

    app.use(
      '/graphql',
      cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*', credentials: true }),
      bodyParser.json(),
      expressMiddleware(server)
    );

    // Start HTTP Server
    httpServer.listen(port, () => {
      logger.info(`Server running at http://${host}:${port}`);
    });
  } catch (error) {
    logger.error('Error initializing server:', error);
    process.exit(1);
  }
};
