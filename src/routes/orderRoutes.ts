import { FastifyInstance } from "fastify";
import {
  createOrder,
  getAllOrders,
  getOrdersByUserId
} from "../controllers/orderController";

export async function orderRoutes(app: FastifyInstance) {
  app.post("/orders", createOrder);
  app.get("/orders/:id", getOrdersByUserId);
  app.get("/orders", getAllOrders);
}
