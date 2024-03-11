import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const login = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;
    if (password !== undefined && email !== undefined) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (existingUser) {
        const checkPassword = bcrypt.compareSync(password, existingUser.password || "1212");
        if (checkPassword) {
          const token = JWT.sign(
            {
              data: existingUser,
            },
            process.env.JWT_SECRET || "",
            { expiresIn: "1d" }
          );
          return res.json({
            meta: {
              success: true,
              message: "success",
              devMessage: "user-login",
            },
            body: {
              token,
              user: {
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email,
              },
            },
          });
        } else {
          return res.json({
            meta: {
              success: false,
              message: "wrong password",
              devMessage: "user-login-failed",
            },
            body: "",
          });
        }
      } else {
        return res.json({
          meta: {
            success: false,
            message: "user not exist!",
            devMessage: "",
          },
        });
      }
    } else {
      return res.json({
        meta: {
          success: false,
          message: "fields-required",
          devMessage: "",
        },
      });
    }
  } catch (err) {
    return res.json({
      meta: {
        success: false,
        message: "internal-server-error",
        devMessage: err,
      },
    });
  }
};
