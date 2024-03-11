import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from "express";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export const getMessages = async (req: Request, res: Response) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log(req.body.text);
    const result = await model.generateContent(req.body.text);
    const text = result.response.text();
    return res.json({
      meta: {
        success: true,
        message: "success",
        devMessage: "",
      },
      body: {
        text,
      },
    });
  } catch (err) {
    console.log(err);
    return "Sorry, we can not answer due to safety reasons.";
  }
};
