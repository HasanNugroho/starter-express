import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers, typeDefs } from '../graph';
import logger from './logger';

export class ApolloServerConfig {
  private server: ApolloServer;

  constructor() {
    this.server = this.createApolloServer();
  }

  private createApolloServer(): ApolloServer<any> {
    return new ApolloServer({
      typeDefs,
      resolvers,
      // context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }), // Pass context to resolvers
      // subscriptions: {
      //   onConnect: (connectionParams: ConnectionParams, webSocket: WebSocket) => {
      //     console.log('Connected with params:', connectionParams);
      //     return {}; // Return any initial value needed for the subscription context
      //   },
      //   path: '/graphql-subscriptions', // Path for subscriptions
      // },
    });
  }


  public async start() {
    try {
      const { url } = await startStandaloneServer(this.server, {
        listen: { port: Number(process.env.GRAPHQL_PORT) || 4000 },
      });
      logger.info(`GraphQL Server ready at: ${url}`);
    } catch (error) {
      logger.error('Error starting server:', error);
    }
  }
}
