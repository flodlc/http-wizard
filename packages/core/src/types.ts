import { CallTypeProvider, TypeProvider } from './providers/Provider';
import { RouteDefinition, Schema } from './RouteDefinition';

export type Args<
  S extends Schema,
  TP extends TypeProvider,
> = (S['params'] extends object
  ? { params: CallTypeProvider<S['params'], TP> }
  : { params?: undefined }) &
  (S['querystring'] extends object
    ? { query: CallTypeProvider<S['querystring'], TP> }
    : { query?: undefined }) &
  (S['body'] extends object
    ? { body: CallTypeProvider<S['body'], TP> }
    : { body?: undefined });

export type Response<
  S extends Schema,
  OK extends number,
  TP extends TypeProvider,
> = CallTypeProvider<S['response'][OK], TP>;

export type OkResponse<
  D extends RouteDefinition,
  TP extends TypeProvider,
> = Response<D['schema'], D['okCode'] extends number ? D['okCode'] : 200, TP>;
