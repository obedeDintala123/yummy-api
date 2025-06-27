import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

const prisma = new PrismaClient();

export const createUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const {
    name,
    email,
    password,
    phone,
    address,
    creditCard
  } = request.body as any;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        phone,
        address,
        creditCard
      }
    });

    return reply
      .status(201)
      .send({ message: "User created successfully", user });
  } catch (error) {
    return reply
      .status(500)
      .send({ error: "Error creating user", details: error });
  }
};

export const getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const users = await prisma.user.findMany();
        return reply.send(users);
    } catch (error) {
        return reply
            .status(500)
            .send({ error: "Error fetching users", details: error });
        
    }
}