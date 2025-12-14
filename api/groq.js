// api/groq.js – Vercel Serverless Function

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { city } = req.body || {};

    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY missing on server");
      return res
        .status(500)
        .json({ error: "Server API key not configured" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "user",
              content: `Explain AQI for ${city}. Include AQI level, health impact, precautions, and why AQI is important.`,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("Groq response:", response.status, data);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Groq API error",
        detail: data,
      });
    }

    const reply =
      data?.choices?.[0]?.message?.content || "No AI reply from model";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({
      error: "Server error",
      detail: String(err),
    });
  }
}
