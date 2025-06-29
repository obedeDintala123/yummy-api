import { FastifyInstance } from "fastify";
import { createOrder, getAllOrders } from "../controllers/orderController";

export async function orderRoutes(app: FastifyInstance) {
  app.post("/orders", createOrder);
  app.get("/orders", getAllOrders);
}
