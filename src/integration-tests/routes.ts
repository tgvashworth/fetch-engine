import { IRouteConfiguration } from "hapi";

export const routes: IRouteConfiguration[] = [
  {
    method: "GET",
    path: "/echo/text/{text}",
    handler: function (request, reply): void {
      reply(decodeURIComponent((<any>request.params).text));
    }
  },
  {
    method: "GET",
    path: "/echo/header/{key}",
    handler: function (request, reply): void {
      reply(request.headers[(<any>request.params).key]);
    }
  },
  {
    method: "POST",
    path: "/echo/body",
    handler: function (request, reply): void {
      reply(request.payload);
    }
  },
  {
    method: "GET",
    path: "/echo/cookie/{key}",
    handler: function (request, reply): void {
      reply(request.state[(<any>request.params).key]);
    }
  }
];

export const states = [
  {
    name: "example-cookie",
    config: {
      path: "/",
      ttl: 0
    }
  }
];
