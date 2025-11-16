// helpers/gemini.js
const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.GOOGLE_API_KEY;

// --- Rate limiting setup ---
let lastCall = 0;
const MIN_DELAY = 1100; // 1.1s between calls (~55 requests/min)

const callGeminiAPI = async (prompt) => {
  try {
    // Apply simple delay to avoid quota errors
    const now = Date.now();
    const wait = Math.max(0, MIN_DELAY - (now - lastCall));
    if (wait > 0) {
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
    lastCall = Date.now();

    // Make API call
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    // Extract response text safely
    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";
    return reply;
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.message;

    // Graceful error handling
    if (errMsg.includes("Quota exceeded")) {
      return "⚠️ Gemini API quota exceeded. Please try again later.";
    }

    if (errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("429")) {
      return "⚠️ Too many requests. Please slow down and try again.";
    }

    // Unknown error → rethrow
    throw new Error(errMsg);
  }
};

module.exports = { callGeminiAPI };
