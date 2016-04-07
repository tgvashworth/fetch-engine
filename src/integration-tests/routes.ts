import { IRouteConfiguration } from "hapi";

export const routes: IRouteConfiguration[] = [
  {
    method: "GET",
    path: "/",
    handler: function (request, reply): void {
      reply("Hello, world!");
    },
    config: {
      cors: true
    }
  }
];
