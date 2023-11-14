import { AxiosInstance, AxiosRequestConfig } from 'axios';

import { TypeProvider } from '../providers/Provider';
import { RouteDefinition } from '../RouteDefinition';
import { Args, OkResponse } from '../types';

const processUrl = (url: string, args: object) =>
  Object.entries(('params' in args ? args?.params : undefined) ?? {}).reduce(
    (acc, [key, value]) =>
      acc.replace(new RegExp(`:${key}`, 'g'), value as string),
    url
  );

export const createRouteUri = <
  D extends RouteDefinition,
  TP extends TypeProvider,
>({
  method,
  url,
  instance,
  args,
  config,
}: {
  method: AxiosRequestConfig['method'];
  url: string;
  instance: AxiosInstance;
  args: Args<D['schema'], TP>;
  config?: AxiosRequestConfig;
}): string => {
  return instance.getUri({
    method,
    url: processUrl(url, args),
    params: args?.query,
    data: args?.body,
    ...config,
    ...args,
  });
};

export const query = async <
  D extends RouteDefinition,
  TP extends TypeProvider,
>({
  method,
  url,
  instance,
  args,
  config,
}: {
  method: AxiosRequestConfig['method'];
  url: string;
  instance: AxiosInstance;
  args: Args<D['schema'], TP>;
  config?: AxiosRequestConfig;
}): Promise<OkResponse<D, TP>> => {
  const { data } = await instance.request({
    method,
    url: processUrl(url, args),
    ...config,
    params: 'query' in args ? args.query : undefined,
    data: 'body' in args ? args.body : undefined,
  });

  return data;
};

export type Client<
  Definitions extends Record<string, RouteDefinition>,
  TP extends TypeProvider,
> = {
  ref: <URL extends keyof Definitions & string>(
    url: URL
  ) => Ref<Definitions, URL, TP>;
  infer: {
    [URL in keyof Definitions & string]: OkResponse<Definitions[URL], TP>;
  };
  inferArgs: {
    [URL in keyof Definitions & string]: Args<Definitions[URL]['schema'], TP>;
  };
};

export type Ref<
  Definitions extends Record<string, RouteDefinition>,
  URL extends keyof Definitions & string,
  TP extends TypeProvider,
> = {
  url: (
    args: Args<Definitions[URL]['schema'], TP>,
    config?: AxiosRequestConfig
  ) => string;
  query: (
    args: Args<Definitions[URL]['schema'], TP>,
    config?: AxiosRequestConfig
  ) => Promise<OkResponse<Definitions[URL], TP>>;
};

export const createClient = <
  Definitions extends Record<string, RouteDefinition>,
  TP extends TypeProvider,
>({
  instance,
}: {
  instance: AxiosInstance;
}) => {
  return {
    route: <URL extends keyof Definitions & string>(
      url: URL,
      args: Args<Definitions[URL]['schema'], TP>,
      config?: AxiosRequestConfig
    ) => {
      const method = url.split(']')[0].replace('[', '');
      const shortUrl = url.split(']').slice(1).join(']');
      return {
        url: createRouteUri<Definitions[URL], TP>({
          url: shortUrl,
          method,
          instance,
          args,
          config,
        }),
        query: () => {
          return query<Definitions[URL], TP>({
            url: shortUrl,
            method,
            instance,
            args,
            config,
          });
        },
      };
    },
    ref: <URL extends keyof Definitions & string>(
      url: URL
    ): Ref<Definitions, URL, TP> => {
      const method = url.split(']')[0].replace('[', '');
      const shortUrl = url.split(']').slice(1).join(']');
      return {
        url: (
          args: Args<Definitions[URL]['schema'], TP>,
          config?: AxiosRequestConfig
        ) =>
          createRouteUri<Definitions[URL], TP>({
            url: shortUrl,
            method,
            instance,
            args,
            config,
          }),
        query: (
          args: Args<Definitions[URL]['schema'], TP>,
          config?: AxiosRequestConfig
        ) => {
          return query<Definitions[URL], TP>({
            url: shortUrl,
            method,
            instance,
            args,
            config,
          });
        },
      };
    },
    infer: undefined as unknown as {
      [URL in keyof Definitions & string]: OkResponse<Definitions[URL], TP>;
    },
    inferArgs: undefined as unknown as {
      [URL in keyof Definitions & string]: Args<Definitions[URL]['schema'], TP>;
    },
  };
};
