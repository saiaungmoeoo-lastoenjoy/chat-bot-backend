import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

const getActiveUser = async (req: Request, res: Response) => {
  try {
    if (req.headers.authorization) {
      // Get token from header
      const token = req.headers.authorization.split(" ")[1];
      // Verify token
      const decode = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload | string;

      if (typeof decode === "string") {
        return res.status(400).json({ error: "Invalid token" });
      }

      try {
        const userId = decode.data.id;
        if (!userId) {
          return res.status(400).json({ error: "User ID not provided" });
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (user) {
          const { name, email } = user;
          return res.status(200).json({ name, email });
        } else {
          return res.status(404).json("User not found");
        }
      } catch (error: any) {
        return res.status(500).json({ error: "Internal server error" });
      }
    } else {
      return res.status(400).json({ message: "Unauthorized" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default getActiveUser;
