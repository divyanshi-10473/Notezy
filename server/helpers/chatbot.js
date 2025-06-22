// helpers/gemini.js
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GOOGLE_API_KEY;

const callGeminiAPI = async (prompt) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    return reply;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || error.message);
  }
};

module.exports = { callGeminiAPI };
