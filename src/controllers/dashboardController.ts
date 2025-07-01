import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDashboardData(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // 1. Obter apenas 4 menus diferentes (excluindo duplicados pelo título)
    const menus = await prisma.menu.findMany({
      take: 4,
      distinct: ["title"] // ou 'name' dependendo do campo único
    });

    // 2. Obter os 2 pedidos (orders) mais recentes
    const recentOrders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 2
    });

    // 3. Obter a reserva (reservation) mais recente
    const recentReservation = await prisma.reservation.findFirst({
      orderBy: {
        createdAt: "desc"
      }
    });

    return reply.send({
      menus,
      recentOrders,
      recentReservation
    });
  } catch (error) {
    request.log.error(error);
    return reply
      .status(500)
      .send({ error: "Erro ao obter dados do dashboard" });
  }
}
