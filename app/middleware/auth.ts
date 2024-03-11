import { Request, Response } from "express";

const jwt = require("jsonwebtoken");

// Authenticate user middleware
const requireLogin = (req: Request, res: Response, next: any) => {
  try {
    if (req.headers.authorization) {
      // Get token from header
      const token = req.headers.authorization.split(" ")[1];
      // Verify token
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      // Attach token with request
      req.body.user = decode;
      next();
    } else {
      return res.status(400).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.log("Something went wrong");
  }
};

export default requireLogin;
