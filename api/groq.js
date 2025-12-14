export async function POST(request) {
  try {
    const { city } = await request.json();

    if (!city) {
      return Response.json(
        { error: "City is required" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY missing on server");
      return Response.json(
        { error: "Server API key not configured" },
        { status: 500 }
      );
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
      return Response.json(
        { error: "Groq API error", detail: data },
        { status: response.status }
      );
    }

    const reply =
      data?.choices?.[0]?.message?.content || "No AI reply from model";

    return Response.json({ reply }, { status: 200 });
  } catch (err) {
    console.error("Handler error:", err);
    return Response.json(
      { error: "Server error", detail: String(err) },
      { status: 500 }
    );
  }
}
