import { Express } from 'express';
import http from 'http';
import cors from 'cors';
import logger from './core/logger';
import bodyParser from 'body-parser';
import redisClient from './core/redis';
import schema from './graph';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

// start service
export const startServer = async (app: Express) => {
  try {
    const port = process.env.PORT ? Number(process.env.PORT) : 5000;
    const host = process.env.HOST ?? 'localhost';

    const httpServer = http.createServer(app);

    // start graphql
    const server = new ApolloServer({
      schema: schema,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();

    app.use(
      '/graphql',
      cors(),
      bodyParser.json(),
      expressMiddleware(server, {
        context: async ({ req }) => ({
          ip: req.ip,
          token: req.headers.authorization || '',
        }),
      })
    );

    // start http
    httpServer.listen(port, () => {
      logger.info(`Server running at http://${host}:${port}`);
    });
  } catch (error) {
    logger.error('Error initializing server:', error);
    process.exit(1);
  }
};
