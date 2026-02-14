export default async function handler(req, res) {
  const { vehicle, apiKey } = req.body;

  // This scrubs out any "ghost" characters from the copy-paste that cause the ISO error
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
        messages: [
          { 
            role: "user", 
            content: `You are the Haynes Research Swarm. Deeply research the ${vehicle}. Scour Reddit, NHTSA, and forums. Provide: 1. Top 10 Common Issues (ranked), 2. High-converting PDP Content, 3. 10 SEO Blog Outlines.` 
          }
        ],
        temperature: 0.5,
        max_tokens: 4000
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Bridge Connection Failed: " + error.message });
  }
}
