import { rest } from 'msw';

export const mockAccount = {
  id: '1',
  ownerId: 1,
  ownerName: 'John Smith',
  ownerAddress: '123 Main St',
  currency: 'USD',
  balance: 1000,
  createdAt: '2025-06-01T17:54:27.124Z',
  updatedAt: '2025-06-01T17:54:27.124Z',
};

export const handlers = [
  rest.get('http://localhost:3001/api/accounts', (req, res, ctx) => {
    return res(ctx.json([mockAccount]));
  }),

  rest.get('http://localhost:3001/api/accounts/owner/:id', (req, res, ctx) => {
    return res(ctx.json([mockAccount]));
  }),

  rest.post('http://localhost:3001/api/accounts', (req, res, ctx) => {
    return res(ctx.json(mockAccount));
  }),

  rest.put('http://localhost:3001/api/accounts/:id', (req, res, ctx) => {
    return res(ctx.json(mockAccount));
  }),

  rest.delete('http://localhost:3001/api/accounts/:id', (req, res, ctx) => {
    return res(ctx.json({}));
  }),

  rest.get('http://localhost:3001/api/accounts/search', (req, res, ctx) => {
    return res(ctx.json([mockAccount]));
  }),

  rest.get('http://localhost:3001/api/transfers/preview', (req, res, ctx) => {
    return res(ctx.json({ convertedAmount: 900 }));
  }),
]; 