import { PrismaClient } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

export const createReservation = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { userId, date, peopleCount } = request.body as any;

  if (
    !userId ||
    !date ||
    !peopleCount ||
    typeof userId !== "number" ||
    typeof date !== "string" ||
    typeof peopleCount !== "number"
  ) {
    return reply.status(400).send({
      message:
        "Missing or invalid required fields. Required: userId (number), date (string), peopleCount (number)."
    });
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      return reply.status(404).send({
        error: "User not found",
        message: `User not found`
      });
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId,
        date: new Date(date),
        peopleCount
      }
    });

    return reply.status(201).send(reservation);
  } catch (error) {
    return reply.status(500).send({
      error: "Failed to create reservation",
      message: error instanceof Error ? error.message : String(error)
    });
  }
};

export const getReservationByUserId = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };

  if (!id) {
    return reply.status(400).send({ message: "User ID is required" });
  }

  const numericId = Number(id);
  if (isNaN(numericId)) {
    return reply.status(400).send({ message: "Invalid user ID format" });
  }

  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: numericId },
      include: { user: true },
      orderBy: {
        createdAt: "desc"
      }
    });
    return reply.send(reservations);
  } catch (error) {
    return reply.status(500).send({ error: "Failed to fetch reservations" });
  }
};

export const getAllReservations = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: { user: true },
      orderBy: {
        createdAt: "desc"
      }
    });
    return reply.send(reservations);
  } catch (error) {
    return reply.status(500).send({ error: "Failed to fetch reservations" });
  }
};
