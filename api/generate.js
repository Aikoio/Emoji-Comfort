export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { emoji } = req.body;

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Create short comforting quotes based on emojis."
            },
            {
              role: "user",
              content: `Emoji: ${emoji}`
            }
          ],
          max_tokens: 60,
          temperature: 0.8
        })
      }
    );

    const data = await response.json();

    // Debugging logs
    console.log("OpenAI Response:", JSON.stringify(data, null, 2));

    if (data.choices && data.choices[0] && data.choices[0].message) {
      res.status(200).json({ quote: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "No quote returned from AI", data });
    }

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "AI error", details: error.message });
  }
            }
