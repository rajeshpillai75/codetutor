import Anthropic from '@anthropic-ai/sdk';
import { ChatMessage, ChatbotResponse, MentorPersonality } from './openai';

// Initialize Anthropic client
// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Define system prompts for different mentor personalities
const SYSTEM_PROMPTS = {
  FRIENDLY: `You are Cody, a friendly programming mentor. Be supportive and encouraging. 
  Use simple analogies and clear explanations. Keep responses under 200 words.`,
  
  EXPERT: `You are Dr. Code, an expert programming mentor. Be technically precise and professional. 
  Provide best practices and design patterns. Keep responses under 200 words.`,
  
  ENCOURAGING: `You are Spark, an enthusiastic programming mentor. Be energetic and positive. 
  Celebrate progress and maintain motivation. Keep responses under 200 words.`,
  
  SOCRATIC: `You are Prof. Query, who teaches through guided questioning. 
  Ask thoughtful questions to lead learners to solutions. Keep responses under 200 words.`,
  
  BRIEF: `You are Bit, a concise programming mentor. Be clear but minimalist. 
  Focus on essentials with short examples. Keep responses under 150 words.`
};

/**
 * Get a chatbot response using Anthropic's Claude model
 */
export async function getChatbotResponseWithAnthropic(
  messages: ChatMessage[],
  personality: MentorPersonality = 'FRIENDLY',
  context: { language?: string; currentTopic?: string; userSkillLevel?: string } = {}
): Promise<ChatbotResponse> {
  try {
    // Set system prompt based on personality
    const systemPrompt = SYSTEM_PROMPTS[personality] + `\n\nAdditional context:
      - Programming language: ${context.language || 'Not specified'}
      - Current topic: ${context.currentTopic || 'Not specified'}
      - User skill level: ${context.userSkillLevel || 'intermediate'}
      
      When providing code examples, always use markdown with the appropriate language tag. 
      For example: \`\`\`javascript\n// code here\n\`\`\`
      
      If you're not sure about something, be honest about your limitations.`;

    // Check if API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("Anthropic API key is missing");
      return { 
        message: "The Anthropic API key is not configured. Please contact the administrator." 
      };
    }
    
    // Format messages for Anthropic API - ensuring only valid roles are used
    const formattedMessages = messages.map(msg => {
      // Ensure role is either 'user' or 'assistant' as required by Anthropic
      const role = msg.role === 'user' ? 'user' as const : 'assistant' as const;
      return { role, content: msg.content };
    });

    console.log("Making request to Anthropic API...");
    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1500,
      system: systemPrompt,
      messages: formattedMessages,
    });
    console.log("Anthropic API response received successfully");

    // Extract content safely with robust error handling
    try {
      // Check if response has the expected structure
      if (!response.content || !Array.isArray(response.content) || response.content.length === 0) {
        console.error("Unexpected Anthropic response structure:", response);
        return {
          message: "I received an unexpected response structure. Please try again."
        };
      }

      const messageContent = response.content[0]?.type === 'text' 
        ? response.content[0].text 
        : 'I encountered an error processing your request.';
        
      // Extract code blocks using regex
      const codeRegex = /```([a-zA-Z0-9]+)?\n([\s\S]*?)```/;
      const codeMatch = messageContent.match(codeRegex);

      // Format response as expected by the client
      return {
        message: messageContent,
        code: codeMatch ? codeMatch[2] : undefined,
        language: codeMatch ? codeMatch[1] : undefined,
      };
    } catch (parseError) {
      console.error("Error parsing Anthropic response:", parseError);
      return {
        message: "I had trouble processing the response. Could you try again with a different question?"
      };
    }
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    // Return a fallback response instead of throwing an error
    return { 
      message: "I'm having trouble processing your request right now. Could you try asking me again? If this problem persists, you might want to try switching to a different AI model." 
    };
  }
}