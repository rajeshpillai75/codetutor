export async function check() {
  // Check if Anthropic API key exists
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('Warning: ANTHROPIC_API_KEY is not set. Anthropic AI features will not work.');
  }
  
  // Check if OpenAI API key exists
  if (!process.env.OPENAI_API_KEY) {
    console.warn('Warning: OPENAI_API_KEY is not set. OpenAI features will not work.');
  }
  
  return true;
}