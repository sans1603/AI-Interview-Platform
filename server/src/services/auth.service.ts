import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const { password: _, ...safeUser } = user;

  return safeUser;
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  console.log("User from DB:", user);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  console.log("Entered Password:", password);
  console.log("Stored Hash:", user.password);

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  console.log("Password Match:", isPasswordValid);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  const { password: _, ...safeUser } = user;

  return {
    token,
    user: safeUser,
  };
};