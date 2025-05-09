import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "your-api-key" });

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

    const result = JSON.parse(response.choices[0].message.content) as CodeFeedback;
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

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error searching YouTube videos:", error);
    return [];
  }
}
