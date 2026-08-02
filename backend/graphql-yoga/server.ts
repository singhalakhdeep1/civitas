// GraphQL Yoga server for Civitas

import { createServer } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from './resolvers';

const typeDefs = `
  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
    createdAt: String!
  }

  type Citizen {
    id: ID!
    userId: ID!
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    address: Address
    documents: [Document!]!
  }

  type Address {
    id: ID!
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }

  type Document {
    id: ID!
    citizenId: ID!
    type: String!
    number: String!
    issuedDate: String!
    expiryDate: String!
  }

  type Service {
    id: ID!
    name: String!
    description: String!
    category: String!
    status: String!
  }

  type ServiceRequest {
    id: ID!
    citizenId: ID!
    serviceId: ID!
    status: String!
    submittedAt: String!
    completedAt: String
  }

  type Query {
    getUser(id: ID!): User
    getCitizen(id: ID!): Citizen
    getServices: [Service!]!
    getServiceRequests(citizenId: ID!): [ServiceRequest!]!
  }

  type Mutation {
    createUser(email: String!, name: String!, password: String!): User
    createCitizen(userId: ID!, firstName: String!, lastName: String!, dateOfBirth: String!): Citizen
    submitServiceRequest(citizenId: ID!, serviceId: ID!): ServiceRequest
    updateServiceRequestStatus(requestId: ID!, status: String!): ServiceRequest
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = createServer({
  schema,
  port: 4000,
});

server.start();
