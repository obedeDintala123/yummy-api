import { FastifyInstance } from "fastify";
import { createUser, getAllUsers, loginUser } from "../controllers/userController";

export const userRoutes = async (app: FastifyInstance) => {
  app.post("/register", createUser);
  app.post("/login", loginUser);
  app.get("/users", getAllUsers);
};