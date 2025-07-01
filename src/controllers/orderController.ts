import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

export const createOrder = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { date, productName, price, userId } = request.body as any;

  // Verificação básica dos campos
  if (
    !userId ||
    !date ||
    !productName ||
    typeof price !== "number" ||
    typeof userId !== "number" ||
    typeof date !== "string" ||
    typeof productName !== "string"
  ) {
    return reply.status(400).send({
      message:
        "Missing or invalid required fields. Required: userId (number), date (string), productName (string), price (number)."
    });
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      return reply.status(404).send({
        error: "User not found",
        message: `No user found with ID ${userId}`
      });
    }

    const order = await prisma.order.create({
      data: {
        date: new Date(date),
        productName,
        price,
        userId
      }
    });

    reply.status(201).send(order);
  } catch (error) {
    reply.status(500).send({
      error: "Failed to create order",
      message: error instanceof Error ? error.message : String(error)
    });
  }
};

export const getOrdersByUserId = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };

    if (!id) {
      return reply.status(400).send({ message: "User ID is required" });
    }

    const numericId = Number(id);
    if (isNaN(numericId)) {
      return reply.status(400).send({ message: "Invalid user ID format" });
    }

    const orders = await prisma.order.findMany({
      where: { userId: numericId },
      include: { user: true },
      orderBy: { createdAt: "desc" }
    });

    return reply.send(orders);
  } catch (error) {
    return reply
      .status(500)
      .send({ error: "Failed to fetch user orders", details: error });
  }
};

export const getAllOrders = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true },
      orderBy: {
        createdAt: "desc"
      }
    });
    return reply.send(orders);
  } catch (error) {
    return reply.status(500).send({ error: "Failed to fetch orders" });
  }
};
