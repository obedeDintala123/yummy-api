import dotenv from "dotenv";
import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

dotenv.config();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getDashboardData(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const userId = decoded.userId;

    const menus = await prisma.menu.findMany({
      take: 4,
      distinct: ["title"]
    });

    const recentOrders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 2
    });

    const recentReservation = await prisma.reservation.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return reply.send({
      menus,
      recentOrders,
      recentReservation
    });
  } catch (error) {
    return reply.status(500).send({
      error: "Erro ao obter dados do dashboard",
      details: error
    });
  }
}
