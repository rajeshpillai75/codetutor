import { ChatMessage, ChatbotResponse, MentorPersonality, MentorPersonalities } from './openai';
import fetch from 'node-fetch';
import { z } from 'zod';

// Define the structure for Perplexity API request and response
interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityRequest {
  model: string;
  messages: PerplexityMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  search_domain_filter?: string[];
  return_images?: boolean;
  return_related_questions?: boolean;
  search_recency_filter?: string;
  top_k?: number;
  stream?: boolean;
  presence_penalty?: number;
  frequency_penalty?: number;
}

interface PerplexityResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  citations?: string[];
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
    delta?: {
      role: string;
      content: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Validation schema for code feedback
export const codeFeedbackSchema = z.object({
  feedback: z.string(),
  suggestions: z.array(z.string()),
  bestPractices: z.array(z.string()),
  errorDetection: z.array(z.object({
    line: z.number(),
    message: z.string(),
  })).optional()
});

export type CodeFeedback = z.infer<typeof codeFeedbackSchema>;

/**
 * Get AI-powered feedback on user's code using Perplexity API (Llama 3)
 */
export async function getCodeFeedbackWithPerplexity(
  code: string,
  language: string,
  query?: string
): Promise<CodeFeedback> {
  try {
    // Construct the system prompt
    const systemPrompt = `You are an expert coding tutor specializing in ${language}. 
      Analyze the following code and provide helpful feedback.
      Your response MUST be in the following JSON format:
      {
        "feedback": "Overall analysis of the code",
        "suggestions": ["Specific, actionable suggestion 1", "Suggestion 2"],
        "bestPractices": ["Best practice 1", "Best practice 2"],
        "errorDetection": [{"line": line_number, "message": "Description of the error"}]
      }
      If there are no errors, omit the errorDetection field.
      Focus on: code structure, best practices, potential bugs, efficiency, and readability.
      ${query ? `The user specifically asked: ${query}` : ''}`;

    const userPrompt = `Here's the ${language} code to analyze:\n\`\`\`${language}\n${code}\n\`\`\``;

    // Make request to Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 2048,
        stream: false,
        frequency_penalty: 1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as PerplexityResponse;
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from Perplexity API');
    }

    // Parse the JSON from the response content
    const content = data.choices[0].message.content;
    let jsonContent: any;

    try {
      // Find and extract JSON content if it's wrapped in markdown
      const jsonMatch = content.match(/```(?:json)?\s*({[\s\S]*?})\s*```/) || 
                        content.match(/{[\s\S]*?}/);
      
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      jsonContent = JSON.parse(jsonStr);
    } catch (err) {
      console.error('Error parsing JSON from Perplexity response:', err);
      // Fallback if JSON parsing fails
      return {
        feedback: "I couldn't properly analyze the code due to a technical issue. Please try again.",
        suggestions: ["Try breaking down your code into smaller functions"],
        bestPractices: ["Add comments to your code to explain complex logic"]
      };
    }

    // Validate the response
    const validatedFeedback = codeFeedbackSchema.safeParse(jsonContent);
    
    if (!validatedFeedback.success) {
      console.error('Invalid response from Perplexity:', validatedFeedback.error);
      // Fallback if validation fails
      return {
        feedback: jsonContent.feedback || "I analyzed your code but couldn't format the response properly.",
        suggestions: Array.isArray(jsonContent.suggestions) ? jsonContent.suggestions : ["Review your code for potential improvements"],
        bestPractices: Array.isArray(jsonContent.bestPractices) ? jsonContent.bestPractices : ["Follow language-specific best practices"]
      };
    }

    return validatedFeedback.data;
  } catch (error) {
    console.error('Error getting code feedback with Perplexity:', error);
    throw error;
  }
}

/**
 * Get a chatbot response using Perplexity's Llama 3 model
 */
export async function getChatbotResponseWithPerplexity(
  messages: ChatMessage[],
  language: string = 'javascript',
  topic: string = 'general',
  personality: MentorPersonality = 'FRIENDLY',
): Promise<ChatbotResponse> {
  try {
    // Define personality system prompts
    const personalityPrompts: Record<MentorPersonality, string> = {
      [MentorPersonalities.FRIENDLY]: `You are Cody, a friendly and approachable programming mentor specialized in ${language}. 
        You help beginners learn to code. Be conversational, encouraging, and explain concepts in simple terms. 
        Use analogies to help explain complex topics. Keep responses short and engaging.`,
      
      [MentorPersonalities.EXPERT]: `You are Dr. Code, an expert software engineer and computer science professor specialized in ${language}. 
        You provide detailed technical explanations and professional advice. Use proper terminology and reference academic concepts.
        Maintain a professional tone throughout. Your knowledge is advanced and comprehensive.`,
      
      [MentorPersonalities.ENCOURAGING]: `You are Spark, an energetic and motivating programming coach specialized in ${language}.
        Your goal is to boost confidence and inspire users on their coding journey. Use positive reinforcement and an upbeat tone. 
        Emphasize the learner's progress and growth mindset. Make coding feel exciting and achievements feel significant.`,
      
      [MentorPersonalities.SOCRATIC]: `You are Professor Query, a mentor who teaches through guided questioning. 
        You rarely provide direct answers, instead leading students to discover solutions by asking thoughtful questions.
        Help develop critical thinking by breaking problems down into smaller questions. Encourage reflection and analysis.`,
      
      [MentorPersonalities.BRIEF]: `You are Bit, a concise and efficient programming mentor. 
        You provide brief, direct answers without unnecessary explanation. Focus on correct information with minimal text.
        Use bullet points, short sentences, and code examples when appropriate. Avoid pleasantries and get straight to the point.`
    };

    // Get the correct personality system prompt
    const systemPrompt = personalityPrompts[personality] + `
      Focus on ${topic} in ${language}. When providing code examples, wrap them in triple backticks with the correct language annotation.
      If providing resources, format them as a list of objects with title and url properties.`;

    // Convert our messages to Perplexity messages format
    const perplexityMessages: PerplexityMessage[] = messages.map(msg => ({
      role: msg.role as 'system' | 'user' | 'assistant',
      content: msg.content
    }));

    // Add system message at the beginning
    perplexityMessages.unshift({
      role: 'system',
      content: systemPrompt
    });

    // Make request to Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: perplexityMessages,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 2048,
        stream: false,
        frequency_penalty: 0.5
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as PerplexityResponse;
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from Perplexity API');
    }

    const content = data.choices[0].message.content;

    // Parse response to extract potential components
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const resourceRegex = /(?:Recommended Resources:|Resources:|References:|Links:)\s*([\s\S]*?)(?:\n\n|$)/i;
    
    // Extract and remove the code from the content
    let cleanedContent = content;
    let codeSnippet = '';
    let codeLang = '';
    
    const codeMatch = codeRegex.exec(content);
    if (codeMatch && codeMatch.length >= 3) {
      codeLang = codeMatch[1] || '';
      codeSnippet = codeMatch[2].trim();
      cleanedContent = cleanedContent.replace(codeMatch[0], '').trim();
    }

    // Extract resources if present
    const resources = [];
    const resourceMatch = resourceRegex.exec(cleanedContent);
    
    if (resourceMatch) {
      const resourcesText = resourceMatch[1];
      const resourceLines = resourcesText.split('\n');
      
      for (const line of resourceLines) {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          // Try to parse resource links in various formats
          const titleUrlMatch = trimmedLine.match(/(?:\d+\.\s*)?(?:\*\s*)?(?:-\s*)?(.+?)(?:\s*[-–:]\s*|\s*\[|\s*\()(https?:\/\/[^\s\)\]]+)/i);
          
          if (titleUrlMatch && titleUrlMatch.length >= 3) {
            resources.push({
              title: titleUrlMatch[1].trim(),
              url: titleUrlMatch[2].trim()
            });
          }
        }
      }
      
      // Remove the resources section from the message
      cleanedContent = cleanedContent.replace(resourceMatch[0], '').trim();
    }

    // Construct the structured response
    const chatbotResponse: ChatbotResponse = {
      message: cleanedContent
    };

    if (codeSnippet) {
      chatbotResponse.code = codeSnippet;
      chatbotResponse.language = codeLang;
    }

    if (resources.length > 0) {
      chatbotResponse.resources = resources;
    }

    return chatbotResponse;
  } catch (error) {
    console.error('Error getting chatbot response with Perplexity:', error);
    throw error;
  }
}