import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

const createNewUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({ data });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const salt = parseInt(process.env.SALT_PASS || "10");
    const hashedPw = await bcrypt.hash(password, salt);

    if (name !== undefined && email !== undefined && password !== undefined) {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (user) {
        return res.json({
          meta: {
            success: false,
            message: "User already Existed.",
            devMessage: "",
          },
        });
      }
      const createdUser = await createNewUser({
        name,
        email,
        password: hashedPw,
      });
      return res.json({
        meta: {
          success: true,
          message: "success",
          devMessage: createdUser,
        },
      });
    } else {
      return res.json({
        meta: {
          success: false,
          message: "Fields required.",
          devMessage: "",
        },
      });
    }
  } catch (err) {
    return res.json({
      meta: {
        success: false,
        message: "Internal server error",
        devMessage: err,
      },
    });
  }
};
