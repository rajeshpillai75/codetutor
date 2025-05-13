import type { Express } from "express";
import { createServer, type Server } from "http";
import {
  MentorPersonalities,
  type MentorPersonality,
  getChatbotResponse,
  getCodeFeedback,
  ChatMessage
} from "./openai";
import { getChatbotResponseWithAnthropic } from "./anthropic";

export async function registerRoutes(app: Express): Promise<Server> {
  // AI-related routes
  app.post("/api/ai/code-feedback", async (req, res) => {
    try {
      const { code, language, query } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({ error: "Code and language are required" });
      }
      
      const feedback = await getCodeFeedback(code, language, query);
      res.json(feedback);
    } catch (err) {
      console.error("Error getting code feedback:", err);
      res.status(500).json({ error: "Failed to get code feedback" });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages, currentLanguage, currentTopic, model, personality } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Valid messages array is required" });
      }
      
      const context = {
        language: currentLanguage,
        currentTopic: currentTopic
      };
      
      let selectedPersonality: MentorPersonality = MentorPersonalities.FRIENDLY;
      if (personality && Object.values(MentorPersonalities).includes(personality)) {
        selectedPersonality = personality;
      }
      
      // Verify API keys are available
      if (model === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
        console.error("Anthropic API key is missing");
        return res.status(500).json({ 
          error: "Anthropic API key is missing", 
          message: "The Anthropic API key is not configured. Please contact the administrator." 
        });
      }
      
      if (model !== 'anthropic' && !process.env.OPENAI_API_KEY) {
        console.error("OpenAI API key is missing");
        return res.status(500).json({ 
          error: "OpenAI API key is missing", 
          message: "The OpenAI API key is not configured. Please contact the administrator." 
        });
      }
      
      let response;
      console.log("Using AI model:", model || "openai", "with personality:", selectedPersonality);
      
      // Choose the appropriate AI model based on the request
      if (model === 'anthropic') {
        response = await getChatbotResponseWithAnthropic(
          messages as ChatMessage[],
          selectedPersonality,
          context
        );
      } else {
        // Default to OpenAI
        response = await getChatbotResponse(
          messages as ChatMessage[],
          selectedPersonality,
          context
        );
      }
      
      res.json(response);
    } catch (err) {
      console.error("Error in chat:", err);
      res.status(500).json({ error: "Failed to get chat response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}