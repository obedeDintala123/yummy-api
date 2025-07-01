import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

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
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return reply.status(409).send({ message: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        creditCard
      }
    });

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone
      },
      JWT_SECRET,
      { expiresIn: "1y" }
    );

    return reply
      .status(201)
      .send({ message: "User created successfully", token });
  } catch (error) {
    return reply
      .status(500)
      .send({ error: "Error creating user", details: error });
  }
};

export const loginUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { email, password } = request.body as any;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return reply.status(401).send({ message: "Invalid email or password" });
    }

    // Gera o token com nome, id e email, expira em 1 ano
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1y" }
    );

    return reply.send({ message: "Login successful", token });
  } catch (error) {
    return reply
      .status(500)
      .send({ error: "Error during login", details: error });
  }
};

export const getAllUsers = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const users = await prisma.user.findMany();
    return reply.send(users);
  } catch (error) {
    return reply
      .status(500)
      .send({ error: "Error fetching users", details: error });
  }
};
