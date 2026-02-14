export default async function handler(req, res) {
  const { vehicle, apiKey } = req.body;
  // Clean the key of any ghost characters
  const cleanKey = apiKey.replace(/[^\x00-\x7F]/g, "").trim();

  try {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${cleanKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "moonshotai/kimi-k2.5",
        messages: [{ role: "user", content: `You are the Haynes Research Swarm. Scour sources for ${vehicle}. Provide: 1. Top 10 Issues, 2. PDP Content, 3. 10 SEO Blog Outlines.` }]
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
