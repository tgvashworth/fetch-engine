import { IRouteConfiguration } from "hapi";

export const routes: IRouteConfiguration[] = [
  {
    method: "GET",
    path: "/echo/text/{text}",
    handler: function (request, reply): void {
      reply(decodeURIComponent((<any>request.params).text));
    },
    config: {
      cors: true
    }
  },
  {
    method: "GET",
    path: "/echo/header/{key}",
    handler: function (request, reply): void {
      reply(request.headers[(<any>request.params).key]);
    },
    config: {
      cors: true
    }
  }
];
