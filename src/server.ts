import { Express } from 'express';
import http from 'http';
import cors from 'cors';
import logger from './configs/logger';
import bodyParser from 'body-parser';
import redisClient from './configs/redis';
import schema from './graph';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

// start service
export const startServer = async (app: Express) => {
  try {
    const port = process.env.PORT ? Number(process.env.PORT) : 5000;
    const host = process.env.HOST ?? 'localhost';
    const isProduction = process.env.NODE_ENV === 'production';

    const httpServer = http.createServer(app);

    // start graphql
    const server = new ApolloServer({
      schema: schema,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();

    if (isProduction) {
      app.use('/graphql', (req, res, next) => {
        if (req.method === 'GET') {
          return res.status(403).json({ error: 'not allowed on /graphql in production' });
        }
        next();
      });
    }

    app.use(
      '/graphql',
      cors(),
      bodyParser.json(),
      expressMiddleware(server)
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
