import fastify from "fastify";
import cors from "@fastify/cors";
import { userRoutes } from "./routes/userRoutes";
import { menuRoutes } from "./routes/menuRoutes";
import { reservationRoutes } from "./routes/reservationRoutes";

const server = fastify({ logger: true });

server.register(cors, {
  origin: "*"
});

server.register(userRoutes, { prefix: "/auth" });
server.register(menuRoutes, { prefix: "/api" });
server.register(reservationRoutes, { prefix: "/api" });

server.get("/", async () => {
  return { status: "API rodando com Fastify + TypeScript!" };
});

server.listen(
  { port: 3001, host: "0.0.0.0" },
  (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    server.log.info(`Servidor rodando em ${address}`);
  }
);
