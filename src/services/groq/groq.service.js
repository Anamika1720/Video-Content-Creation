import { GROQ_COMPLETION_URL } from "./groq.config";

export const queryGroq = async (payload) => {
  const response = await fetch(GROQ_COMPLETION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "user",
          content: payload.content,
        },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data;
};

export const getVideoContentQuery = (payload) => {
  return `Give me 1 short and concise video content idea for the topic "${payload.topic}" in a "${payload.tone}" tone, around ${payload.totalLengthInMinutes} minutes long.`;
};
