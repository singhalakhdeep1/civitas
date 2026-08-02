// Apollo Federation citizens subgraph for Civitas

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';

const typeDefs = `#graphql
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type Citizen @key(fields: "id") {
    id: ID!
    userId: ID!
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    user: User
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    citizen: Citizen
  }

  type Query {
    getCitizen(id: ID!): Citizen
    getCitizens: [Citizen!]!
  }
`;

const resolvers = {
  Query: {
    getCitizen: (_: any, { id }: { id: string }) => ({
      id,
      userId: '1',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01'
    }),
    getCitizens: () => [
      {
        id: '1',
        userId: '1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      }
    ]
  },
  Citizen: {
    user: (citizen: any) => ({ __typename: 'User', id: citizen.userId })
  },
  User: {
    citizen: (user: any) => ({ __typename: 'Citizen', userId: user.id })
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }])
});

startStandaloneServer(server, { listen: { port: 4002 } });
