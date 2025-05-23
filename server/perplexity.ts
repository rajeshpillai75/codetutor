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
    console.log('Making request to Perplexity API for code feedback...');
    
    const requestBody = {
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
    };
    
    console.log('Perplexity code feedback request payload:', {
      model: requestBody.model,
      language: language,
      codeLength: code.length,
      systemPromptLength: systemPrompt.length
    });
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Perplexity API error: ${response.status}`, errorText);
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }
    
    console.log('Perplexity API code feedback response received successfully');

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
      [MentorPersonalities.FRIENDLY]: `You are Cody, a friendly programming mentor for ${language}. 
        Be conversational and encouraging. Use simple terms and analogies. 
        STRICT LIMIT: Keep responses under 300 words total. Focus on practical help.
        Do not introduce yourself repeatedly.`,
      
      [MentorPersonalities.EXPERT]: `You are Dr. Code, a technical expert in ${language}. 
        Provide precise, professional guidance with best practices. 
        STRICT LIMIT: Keep responses under 300 words total. Be direct and accurate.
        Do not introduce yourself repeatedly.`,
      
      [MentorPersonalities.ENCOURAGING]: `You are Spark, a motivational ${language} coach.
        Be positive and celebrate progress. Use upbeat tone and emphasize growth. 
        STRICT LIMIT: Keep responses under 300 words total. Focus on building confidence.
        Do not introduce yourself repeatedly.`,
      
      [MentorPersonalities.SOCRATIC]: `You are Professor Query, who teaches ${language} through questions. 
        Guide students to discover answers by asking thoughtful questions.
        STRICT LIMIT: Keep responses under 300 words total. Focus on critical thinking.
        Do not introduce yourself repeatedly.`,
      
      [MentorPersonalities.BRIEF]: `You are Bit, a concise ${language} mentor. 
        Give brief, direct answers. Use bullet points and short examples.
        STRICT LIMIT: Keep responses under 200 words total. Be efficient and to the point.
        Do not introduce yourself repeatedly.`
    };

    // Get the correct personality system prompt
    const systemPrompt = personalityPrompts[personality] + `
      Focus on ${topic} in ${language}. When providing code examples, wrap them in triple backticks with the correct language annotation.
      If providing resources, format them as a list of objects with title and url properties.
      
      CRITICAL: Your response MUST be under 300 words total. Be concise and direct. Do not write long introductions.`;

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
    console.log('Making request to Perplexity API for chatbot response...');
    
    const requestBody = {
      model: 'llama-3.1-sonar-small-128k-online',
      messages: perplexityMessages,
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 2048,
      stream: false,
      frequency_penalty: 0.5
    };
    
    console.log('Perplexity request payload:', {
      model: requestBody.model,
      messageCount: requestBody.messages.length,
      system: requestBody.messages[0].content.substring(0, 100) + '...'
    });
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Perplexity API error: ${response.status}`, errorText);
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }
    
    console.log('Perplexity API response received successfully');

    const data = await response.json() as PerplexityResponse;
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from Perplexity API');
    }

    let content = data.choices[0].message.content;
    
    // Clean up common issues with Llama 3 responses
    content = content
      // Fix garbage characters by removing repetitive patterns of "file I/O"
      .replace(/(\bfile I\/\s*\([^)]*\)\s*and\s*)+/g, "file I/O ")
      // Fix specific patterns with "file I/" followed by parentheses
      .replace(/\bfile I\/\s*\([^)]*\)/g, "file I/O")
      // Fix 'yourhead' to 'your head'
      .replace(/\byourhead\b/g, "your head")
      // Remove repetitive number patterns that sometimes appear in citations
      .replace(/\[\d+(,\s*\d+){5,}\]/g, "")
      // Fix citation style formatting
      .replace(/\[(\d+(?:,\s*\d+)*)\]/g, "")
      // Remove redundant self-introductions that might appear multiple times
      .replace(/(\*\*My self\*\*|\*\*My Introduction\*\*|\*\*My self and teaching style\*\*)[\s\S]{0,100}?I['']m\s+(?:Cody|Bit|Spark|Dr\.\s*Code|Professor\s*Query)/gi, "")
      // Fix any repeated whitespace and newlines
      .replace(/\n{3,}/g, "\n\n")
      .replace(/\s{2,}/g, " ");

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