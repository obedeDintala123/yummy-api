import { FastifyInstance } from "fastify";
import { getDashboardData } from "../controllers/dashboardController";

export async function dashboardRoutes(app: FastifyInstance) {
  app.get("/dashboard", getDashboardData);
}