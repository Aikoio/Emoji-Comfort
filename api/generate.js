export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { emoji } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `Create a short comforting quote based on this emoji: ${emoji}`
      })
    });

    const data = await response.json();

    // Safety check
    const quote =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text;

    if (!quote) {
      return res.status(500).json({
        error: "No quote returned",
        raw: data
      });
    }

    res.status(200).json({ quote });

  } catch (err) {
    res.status(500).json({
      error: "AI error",
      details: err.message
    });
  }
        }
