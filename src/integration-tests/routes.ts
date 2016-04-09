import { IRouteConfiguration, Response } from "hapi";
import Boom = require("boom");

export const routes: IRouteConfiguration[] = [
  {
    method: ["GET", "PUT", "POST", "DELETE"],
    path: "/echo",
    handler: function (request, reply): Response {
      return reply({
        method: request.method,
        headers: request.headers,
        payload: request.payload
      });
    }
  },
  {
    method: "GET",
    path: "/echo/text/{text}",
    handler: function (request, reply): Response {
      return reply(decodeURIComponent((<any>request.params).text));
    }
  },
  {
    method: "GET",
    path: "/echo/header/{key}",
    handler: function (request, reply): Response {
      return reply(request.headers[(<any>request.params).key]);
    }
  },
  {
    method: "POST",
    path: "/echo/body",
    handler: function (request, reply): Response {
      return reply(request.payload)
        .header("Content-Type", request.headers["content-type"]);
    },
    config: {
      payload: {
        parse: true
      }
    }
  },
  {
    method: "GET",
    path: "/echo/cookie/{key}",
    handler: function (request, reply): Response {
      return reply(request.state[(<any>request.params).key]);
    }
  },
  {
    method: "GET",
    path: "/error/{code}",
    handler: function (request, reply): Response {
      return reply(Boom.create(500));
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
