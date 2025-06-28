import { PrismaClient } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

export const createReservation = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { userId, date, peopleCount } = request.body as any;

  // Verificação dos campos obrigatórios
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

  console.log(request.body);

  try {
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        date: new Date(date),
        peopleCount
      }
    });

    return reply.status(201).send(reservation);
  } catch (error) {
    return reply
      .status(500)
      .send({ error: "Failed to create reservation", message: error });
  }
};

export const getAllReservations = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: { user: true }
    });
    return reply.send(reservations);
  } catch (error) {
    return reply.status(500).send({ error: "Failed to fetch reservations" });
  }
};
