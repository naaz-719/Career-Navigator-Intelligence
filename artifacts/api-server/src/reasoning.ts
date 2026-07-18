import { Router, type IRouter } from "express";

const router: IRouter = Router();

const CLAUDE_MODEL = "claude-sonnet-4-6";
const ANTHROPIC_API_KEY = process.env["ANTHROPIC_API_KEY"];

interface ReasoningRequestBody {
  prompt: string;
}

router.post("/reasoning/decision", async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  const { prompt } = req.body as ReasoningRequestBody;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "prompt (string) is required" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res
        .status(502)
        .json({ error: "Claude API error", detail: errText });
    }

    const data = await response.json();
    const text = (data.content ?? [])
      .map((block: { type: string; text?: string }) =>
        block.type === "text" ? block.text : "",
      )
      .join("\n");

    return res.json({ text });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to reach Claude API", detail: String(err) });
  }
});

export default router;
