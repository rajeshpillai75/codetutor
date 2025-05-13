# AI Code Tutor - Standalone Application

This is a streamlined version of the CodeTutor application focusing solely on the AI code practice and mentoring features. This version removes the authentication and database requirements, making it easier to set up and use.

## Features

1. **Practice Area**
   - Built-in code editor with syntax highlighting
   - Multiple language support (JavaScript, Python, Java, HTML/CSS)
   - Sample exercises for each language
   - AI-powered code feedback and analysis

2. **AI Mentor**
   - Interactive chat interface for programming help
   - Multiple AI personality types for different learning styles
   - Support for both OpenAI and Anthropic AI models
   - Context-aware responses based on language and topic

## Setup Instructions

To run the AI-only version of the application:

1. **Start the Server**:
   ```
   NODE_ENV=development tsx server/index-ai-only.ts
   ```

2. **Start the Vite Development Server**:
   ```
   npx vite --config vite.config.ai-only.ts
   ```

3. **Access the Application**:
   Open your browser and go to `http://localhost:5173`

## API Keys

This application requires API keys for:
- OpenAI API (for GPT-4o)
- Anthropic API (for Claude)

Add these keys to your environment variables:
```
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
```

## Project Structure

- `client/src/SimplifiedApp.tsx` - Main application component
- `client/src/pages/SimplifiedPracticeArea.tsx` - Code practice area
- `client/src/pages/SimplifiedChatMentor.tsx` - AI chat mentor
- `server/index-ai-only.ts` - Simplified server without authentication
- `server/routes-ai-only.ts` - AI-specific API routes