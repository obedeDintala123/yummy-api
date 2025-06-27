import { FastifyInstance } from "fastify";
import { createMenuItem, getAllMenuItems } from "../controllers/menuController";

export async function menuRoutes(app: FastifyInstance) {
  app.post("/menu", createMenuItem);
  app.get("/menu", getAllMenuItems);
}
