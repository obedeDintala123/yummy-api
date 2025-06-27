import { FastifyInstance } from "fastify";
import { createUser, getAllUsers } from "../controllers/userController";

export const userRoutes = async (app: FastifyInstance) => {
  app.post("/users", createUser);
  app.get("/users", getAllUsers);
};