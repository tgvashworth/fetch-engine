import { IRouteConfiguration } from "hapi";

export const routes: IRouteConfiguration[] = [
  {
    method: "GET",
    path: "/fetch-browser/basic",
    handler: function (request, reply): void {
      reply("Hello fetch-browser");
    },
    config: {
      cors: true
    }
  }
];
