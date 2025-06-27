import { PrismaClient } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";

const prisma = new PrismaClient();

export const createMenuItem = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { image, name, description, price } = request.body as any;

  try {
    const item = await prisma.menu.create({
      data: { image, name, description, price }
    });

    return reply.status(201).send(item);
  } catch (error) {
    return reply
      .status(500)
      .send({ error: "Failed to create menu item", details: error });
  }
};

export const getAllMenuItems = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const items = await prisma.menu.findMany();
    return reply.send(items);
  } catch (error) {
    return reply.status(500).send({ error: "Failed to fetch menu items" });
  }
};
