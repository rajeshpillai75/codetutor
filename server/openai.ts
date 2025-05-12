import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CodeFeedback {
  feedback: string;
  suggestions: string[];
  bestPractices: string[];
  errorDetection?: {
    line: number;
    message: string;
  }[];
}

export async function getCodeFeedback(
  code: string,
  language: string,
  exerciseContext?: string
): Promise<CodeFeedback> {
  try {
    const prompt = `
      You are an expert programming tutor specializing in ${language}. 
      Please analyze the following code and provide constructive feedback. 
      ${exerciseContext ? `The exercise context is: ${exerciseContext}` : ""}
      
      Focus on:
      1. Correctness of the code
      2. Best practices
      3. Code style and readability
      4. Efficiency and performance
      5. Potential bugs or edge cases
      
      Format your response as a JSON object with the following structure:
      {
        "feedback": "Overall assessment of the code",
        "suggestions": ["List of specific improvement suggestions"],
        "bestPractices": ["List of best practices the student should follow"],
        "errorDetection": [{"line": line_number, "message": "Description of the error"}]
      }
      
      Code to analyze:
      \`\`\`${language}
      ${code}
      \`\`\`
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content || '{}';
    const result = JSON.parse(content) as CodeFeedback;
    return result;
  } catch (error) {
    console.error("Error getting code feedback:", error);
    return {
      feedback: "Unable to analyze your code at this moment. Please try again later.",
      suggestions: ["Check for syntax errors in your code."],
      bestPractices: ["Ensure your code follows standard conventions."],
    };
  }
}

export async function searchYouTubeVideos(topic: string): Promise<any> {
  try {
    const prompt = `
      You are an expert programming educator. A student is looking for the best educational videos to learn about "${topic}".
      
      Please search for high-quality YouTube programming tutorial videos on this topic. Focus on finding well-structured, 
      up-to-date video series from reputable creators.
      
      For each video, provide:
      1. Title
      2. Creator name
      3. Video ID (for YouTube embedding)
      4. Duration (in minutes)
      5. A brief description of what the video covers
      
      Format your response as a JSON array with the following structure:
      [
        {
          "title": "Video Title",
          "creator": "Creator Name",
          "videoId": "YouTube Video ID",
          "duration": duration_in_minutes,
          "description": "Brief description of video content"
        }
      ]
      
      Please provide 5-7 high-quality video recommendations.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content || '[]';
    return JSON.parse(content);
  } catch (error) {
    console.error("Error searching YouTube videos:", error);
    return [];
  }
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

export interface ChatbotResponse {
  message: string;
  code?: string;
  language?: string;
  resources?: {
    title: string;
    url: string;
  }[];
}

// Different mentor personalities
const MentorPersonalities = {
  FRIENDLY: "FRIENDLY",
  EXPERT: "EXPERT",
  ENCOURAGING: "ENCOURAGING",
  SOCRATIC: "SOCRATIC",
  BRIEF: "BRIEF"
} as const;

export type MentorPersonality = typeof MentorPersonalities[keyof typeof MentorPersonalities];

// Define personality traits and communication styles
const personalityPrompts: Record<MentorPersonality, string> = {
  [MentorPersonalities.FRIENDLY]: `
    You are a friendly, approachable coding mentor named Cody. You have a warm personality and always try to make 
    learning fun. You use casual language, occasional emojis, and relatable examples. You're encouraging 
    and supportive, like a helpful friend who happens to be an expert coder.
  `,
  [MentorPersonalities.EXPERT]: `
    You are Dr. Code, a distinguished professor of computer science with decades of industry and academic experience.
    Your responses are detailed, precise, and technically rigorous. You provide in-depth explanations of concepts
    and always reference established best practices and design patterns. Your tone is professional but accessible.
  `,
  [MentorPersonalities.ENCOURAGING]: `
    You are Spark, an enthusiastic and motivational coding coach. You focus on building confidence and celebrating
    small wins. You're extremely positive and encouraging, always pointing out what the student is doing right before
    suggesting improvements. You use energetic language and believe anyone can learn to code with persistence.
  `,
  [MentorPersonalities.SOCRATIC]: `
    You are Professor Query, a mentor who teaches through questioning. Rather than giving direct answers,
    you prefer to ask thought-provoking questions that guide the student to discover solutions themselves.
    You're patient, thoughtful, and focused on developing the student's problem-solving skills rather than
    simply providing answers.
  `,
  [MentorPersonalities.BRIEF]: `
    You are Bit, a mentor who values conciseness and efficiency. Your responses are brief, direct, and to the point.
    You prefer bullet points, short examples, and quick explanations over lengthy discussions. You're not rude,
    but you don't waste words and respect the student's time.
  `
};

export async function getChatbotResponse(
  messages: ChatMessage[],
  personality: MentorPersonality = MentorPersonalities.FRIENDLY,
  programmingContext?: {
    language?: string;
    currentTopic?: string;
    userSkillLevel?: 'beginner' | 'intermediate' | 'advanced';
  }
): Promise<ChatbotResponse> {
  try {
    // Create a system message with the selected personality
    const personalityPrompt = personalityPrompts[personality];
    
    const context = programmingContext ? `
      Context about the student:
      ${programmingContext.language ? `- They are currently working with ${programmingContext.language}` : ''}
      ${programmingContext.currentTopic ? `- They are learning about ${programmingContext.currentTopic}` : ''}
      ${programmingContext.userSkillLevel ? `- Their skill level is ${programmingContext.userSkillLevel}` : ''}
    ` : '';
    
    const systemMessage: ChatMessage = {
      role: "system",
      content: `${personalityPrompt}
        
        ${context}
        
        You are a specialized coding mentor focusing on helping students learn programming. 
        You have these capabilities:
        
        1. Explaining programming concepts clearly and accurately
        2. Providing code examples that are correct and follow best practices
        3. Debugging and fixing problematic code
        4. Suggesting learning resources and practice exercises
        5. Answering questions about programming languages, frameworks, and tools
        
        When appropriate, include properly formatted code examples. If you include code in your response,
        format it as follows:
        
        \`\`\`language
        // your code here
        \`\`\`
        
        When sharing resources, provide reputable and up-to-date sources.
        
        Format your response as a JSON object with these fields:
        {
          "message": "Your helpful response text",
          "code": "Optional code example if applicable",
          "language": "The programming language of your code example",
          "resources": [
            {"title": "Resource title", "url": "Resource URL"}
          ]
        }
        
        Only include the code, language, and resources fields if you're providing code examples or resources.
      `
    };
    
    // Prepare the conversation history
    const conversationMessages = [
      systemMessage,
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return { 
        message: "The OpenAI API key is not configured. Please contact the administrator." 
      };
    }
    
    console.log("Making request to OpenAI API...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: conversationMessages,
      response_format: { type: "json_object" },
    });
    console.log("OpenAI API response received successfully");

    const content = response.choices[0].message.content || '{"message":"I\'m sorry, I couldn\'t process your request"}';
    
    try {
      const parsedResponse = JSON.parse(content) as ChatbotResponse;
      return parsedResponse;
    } catch (jsonError) {
      console.error("Error parsing JSON response from OpenAI:", jsonError);
      return { 
        message: "I received a response that I couldn't parse correctly. Could you try asking your question differently?" 
      };
    }
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return { 
      message: "I'm having trouble processing your request right now. Could you try asking me again?" 
    };
  }
}

export { MentorPersonalities };
