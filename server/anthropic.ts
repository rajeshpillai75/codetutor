import Anthropic from '@anthropic-ai/sdk';
import { ChatMessage, ChatbotResponse, MentorPersonality } from './openai';

// Initialize Anthropic client
// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Define system prompts for different mentor personalities
const SYSTEM_PROMPTS = {
  FRIENDLY: `You are Cody, a friendly programming mentor. Your tone is supportive, patient, and approachable. 
  You make complex concepts easy to understand with simple analogies and clear explanations. 
  You encourage learners and remind them that making mistakes is part of the learning process.`,
  
  EXPERT: `You are Dr. Code, an expert programming mentor with extensive industry experience. 
  Your explanations are technically precise and thorough. You provide in-depth knowledge, 
  best practices, and design patterns. You emphasize professional standards and readability.`,
  
  ENCOURAGING: `You are Spark, an enthusiastic programming mentor who loves to inspire learners. 
  Your tone is energetic and positive. You celebrate small wins and encourage experimentation. 
  You help learners see their progress and maintain motivation through challenges.`,
  
  SOCRATIC: `You are Prof. Query, a mentor who teaches through guided questioning. 
  Instead of providing direct answers, you ask thoughtful questions that lead the learner to discover solutions. 
  You help learners develop problem-solving skills and critical thinking.`,
  
  BRIEF: `You are Bit, a programming mentor who values conciseness. 
  Your responses are clear but minimalist, focusing only on what's essential. 
  You provide short code examples and quick explanations without unnecessary details.`
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

    // Format messages for Anthropic API - ensuring only valid roles are used
    const formattedMessages = messages.map(msg => {
      // Ensure role is either 'user' or 'assistant' as required by Anthropic
      const role = msg.role === 'user' ? 'user' as const : 'assistant' as const;
      return { role, content: msg.content };
    });

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1500,
      system: systemPrompt,
      messages: formattedMessages,
    });

    // Extract content safely
    const messageContent = response.content[0].type === 'text' 
      ? response.content[0].text 
      : 'I encountered an error processing your request.';
    const codeRegex = /```([a-zA-Z0-9]+)?\n([\s\S]*?)```/;
    const codeMatch = messageContent.match(codeRegex);

    return {
      message: messageContent,
      code: codeMatch ? codeMatch[2] : undefined,
      language: codeMatch ? codeMatch[1] : undefined,
    };
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    throw new Error('Failed to get response from Anthropic');
  }
}