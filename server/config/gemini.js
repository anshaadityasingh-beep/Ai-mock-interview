const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Send a conversation to Gemini and get a response.
 * @param {string} systemPrompt - The system instruction for the model.
 * @param {Array<{role: 'user'|'model', parts: [{text: string}]}>} history - Conversation history.
 * @param {string} userMessage - The latest user message to send.
 * @returns {Promise<string>} - The AI's response text.
 */
const sendToGemini = async (systemPrompt, history, userMessage) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemPrompt,
  }, { apiVersion: 'v1' });

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
};

module.exports = { sendToGemini };
