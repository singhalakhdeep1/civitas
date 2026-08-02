// Apollo Federation users subgraph for Civitas

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';

const typeDefs = `#graphql
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type User @key(fields: "id") {
    id: ID!
    email: String!
    name: String!
    role: String!
    createdAt: String!
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User!]!
  }
`;

const resolvers = {
  Query: {
    getUser: (_: any, { id }: { id: string }) => ({
      id,
      email: 'user@example.com',
      name: 'John Doe',
      role: 'citizen',
      createdAt: '2024-01-01'
    }),
    getUsers: () => [
      {
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
        role: 'citizen',
        createdAt: '2024-01-01'
      }
    ]
  },
  User: {
    __resolveReference: (user: any) => ({
      id: user.id,
      email: 'user@example.com',
      name: 'John Doe',
      role: 'citizen',
      createdAt: '2024-01-01'
    })
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }])
});

startStandaloneServer(server, { listen: { port: 4001 } });
