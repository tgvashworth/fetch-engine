import Boom = require("boom");
import { IRouteConfiguration, Response } from "hapi";

const basicRoutes: IRouteConfiguration[] = [
  {
    handler(request, reply): Response {
      return reply({
        headers: request.headers,
        method: request.method,
        payload: request.payload,
      });
    },
    method: ["GET", "PUT", "POST", "DELETE"],
    path: "/echo",
  },
  {
    handler(request, reply): Response {
      return reply(decodeURIComponent((request.params as any).text));
    },
    method: "GET",
    path: "/echo/text/{text}",
  },
  {
    handler(request, reply): Response {
      return reply(request.headers[(request.params as any).key]);
    },
    method: "GET",
    path: "/echo/header/{key}",
  },
  {
    config: {
      payload: {
        parse: true,
      },
    },
    handler(request, reply): Response {
      return reply(request.payload)
        .header("Content-Type", request.headers["content-type"]);
    },
    method: "POST",
    path: "/echo/body",
  },
  {
    handler(request, reply): Response {
      return reply(request.state[(request.params as any).key]);
    },
    method: "GET",
    path: "/echo/cookie/{key}",
  },
  {
    handler(request, reply): Response {
      return reply(Boom.create(500));
    },
    method: "GET",
    path: "/error/{code}",
  },
];

const corsRoutes: IRouteConfiguration[] = basicRoutes.map((route) => ({
  ...route,
  config: {
    ...route.config,
    cors: true,
  },
  path: `/cors${route.path}`,
}));

export const routes: IRouteConfiguration[] = basicRoutes.concat(corsRoutes);

export const states = [
  {
    config: {
      path: "/",
      ttl: 0,
    },
    name: "example-cookie",
  },
];
