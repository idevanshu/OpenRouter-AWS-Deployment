import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.APP_URL,
    'X-Title': process.env.APP_NAME,
  }
});

// Available models for users to choose
export const MODELS = {
  GPT_4O: 'openai/gpt-4o',
  CLAUDE_SONNET: 'anthropic/claude-3.5-sonnet',
  DEEPSEEK_R1: 'deepseek/deepseek-r1',
  GEMINI_PRO: 'google/gemini-pro-1.5',
  LLAMA_3: 'meta-llama/llama-3.1-70b-instruct'
};
