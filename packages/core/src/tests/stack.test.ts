import { Type } from '@sinclair/typebox';
import { AxiosInstance } from 'axios';

import { createClient } from '../client/client';
import { TypeBoxTypeProvider } from '../providers/TypeboxProvider';
import { createRoute } from '../server/server';

const getUser = createRoute('/user/:id', {
  method: 'GET',
  schema: {
    params: Type.Object({
      id: Type.String(),
    }),
    response: {
      200: Type.Array(
        Type.Object({
          name: Type.String(),
          age: Type.Number(),
        })
      ),
    },
  },
}).handle(() => {});

const getToken = createRoute('/token', {
  method: 'GET',
  schema: {
    querystring: Type.Object({ size: Type.String() }),
    response: {
      200: Type.String(),
    },
  },
}).handle(() => {});

const createUser = createRoute('/user', {
  method: 'POST',
  schema: {
    body: Type.Object({ name: Type.String() }),
    response: {
      200: Type.String(),
    },
  },
}).handle(() => {});

const routes = { ...getUser, ...getToken, ...createUser };

type Router = typeof routes;

describe('Check requests parameters and response', () => {
  it('it should correctly call axios.request for a GET query with query parameters', async () => {
    const request = jest.fn((_params) => {
      return { data: { name: 'John Doe' } };
    });
    const client = createClient<Router, TypeBoxTypeProvider>({
      instance: {
        request,
        getUri: () => '/user/toto',
      } as unknown as AxiosInstance,
    });

    const user = await client
      .ref('[GET]/user/:id')
      .query({ params: { id: 'toto' } });

    const url = await client.route('[GET]/user/:id', { params: { id: 'toto' } })
      .url;

    expect(request.mock.calls?.[0]?.[0]).toMatchObject({
      url: '/user/toto',
      method: 'GET',
    });
    expect(url).toBe('/user/toto');
    expect(user).toMatchObject({ name: 'John Doe' });
  });

  it('it should correctly call axios.request with corrects parameters for a GET query without arguments', async () => {
    const request = jest.fn((_params) => {
      return { data: 'my-token' };
    });
    const client = createClient<Router, TypeBoxTypeProvider>({
      instance: { request, getUri: () => '' } as unknown as AxiosInstance,
    });

    const token = await client
      .route('[GET]/token', { query: { size: '20' } })
      .query();

    expect(request.mock.calls?.[0]?.[0]).toMatchObject({
      url: '/token',
      method: 'GET',
      params: { size: '20' },
    });
    expect(token).toBe('my-token');
  });

  it('it should correctly call axios.request on a POST query with a body', async () => {
    const request = jest.fn((_params) => {
      return { data: { name: 'John Doe' } };
    });
    const client = createClient<Router, TypeBoxTypeProvider>({
      instance: { request, getUri: () => '' } as unknown as AxiosInstance,
    });

    const user = await client
      .route('[POST]/user', {
        body: { name: 'John Doe' },
      })
      .query();

    expect(request.mock.calls?.[0]?.[0]).toMatchObject({
      url: '/user',
      method: 'POST',
      data: { name: 'John Doe' },
    });
    expect(user).toMatchObject({ name: 'John Doe' });
  });
});
