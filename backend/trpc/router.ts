// tRPC router for Civitas

import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  getUser: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return {
        id: input.id,
        email: 'user@example.com',
        name: 'John Doe',
        role: 'citizen',
        createdAt: new Date().toISOString()
      };
    }),

  getCitizen: t.procedure
    .input(z.object({	id: z.string() }))
    .query(({ input }) => {
      return {
        id: input.id,
        userId: '1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        address: null,
        documents: []
      };
    }),

  getServices: t.procedure
    .query(() => {
      return [
        {
          id: '1',
          name: 'Birth Certificate',
          description: 'Request a birth certificate',
          category: 'Vital Records',
          status: 'active'
        },
        {
          id: '2',
          name: 'ID Card',
          description: 'Request a government ID card',
          category: 'Identification',
          status: 'active'
        }
      ];
    }),

  createUser: t.procedure
    .input(z.object({
      email: z.string().email(),
      name: z.string(),
      password: z.string()
    }))
    .mutation(({ input }) => {
      return {
        id: '1',
        email: input.email,
        name: input.name,
        role: 'citizen',
        createdAt: new Date().toISOString()
      };
    }),

  createCitizen: t.procedure
    .input(z.object({
      userId: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      dateOfBirth: z.string()
    }))
    .mutation(({ input }) => {
      return {
        id: '1',
        userId: input.userId,
        firstName: input.firstName,
        lastName: input.lastName,
        dateOfBirth: input.dateOfBirth,
        address: null,
        documents: []
      };
    })
});

export type AppRouter = typeof appRouter;
