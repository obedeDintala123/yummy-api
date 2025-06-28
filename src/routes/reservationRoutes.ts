import { FastifyInstance } from "fastify";
import { createReservation, getAllReservations } from "../controllers/reservationController";

export async function reservationRoutes(app: FastifyInstance) {
  app.post("/reservations", createReservation);
  app.get("/reservations", getAllReservations);
}