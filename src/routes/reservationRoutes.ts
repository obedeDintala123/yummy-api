import { FastifyInstance } from "fastify";
import {
  createReservation,
  getAllReservations,
  getReservationByUserId
} from "../controllers/reservationController";

export async function reservationRoutes(app: FastifyInstance) {
  app.post("/reservations", createReservation);
  app.get("/reservations", getAllReservations);
  app.get("/reservations/:id", getReservationByUserId);
}
