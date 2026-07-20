import { Router } from "express";

const router = Router();

const N8N_WEBHOOK_URL = "https://naazmulla.app.n8n.cloud/webhook/cv-copilot";
const TIMEOUT_MS = 120_000;

interface CopilotRequestBody {
  cv: string;
  jobDescription: string;
  company: string;
  role: string;
  email: string;
}

router.post("/optimize", async (req, res) => {
  const body = req.body as Partial<CopilotRequestBody>;

  if (!body?.cv || !body?.jobDescription || !body?.company || !body?.role) {
    res
      .status(400)
      .json({ error: "cv, jobDescription, company, and role are required" });
    return;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cv: body.cv,
        jobDescription: body.jobDescription,
        company: body.company,
        role: body.role,
        email: body.email ?? "",
        date: new Date().toISOString(),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      res.status(502).json({ error: "n8n backend unavailable" });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    clearTimeout(timeoutId);
    res.status(502).json({ error: "n8n backend unavailable" });
  }
});

export default router;
