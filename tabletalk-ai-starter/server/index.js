import express from "express";
import cors from "cors";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Please enter a message.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message,
      config: {
        systemInstruction:
          "You are TableTalk AI, a friendly restaurant assistant. Help users with restaurant menus, table reservations, and dining questions. Never claim a reservation is confirmed unless the booking system confirms it.",
      },
    });

    res.json({
      reply: response.text || "Sorry, I could not generate a reply.",
    });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({
      error: "Sorry, the AI assistant is temporarily unavailable.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`TableTalk AI server running on port ${PORT}`);
});
