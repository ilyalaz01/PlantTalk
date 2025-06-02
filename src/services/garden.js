export default async function handler(req, res) {
  try {
    const response = await fetch('https://gardenpi.duckdns.org/');
    const text = await response.text(); // Get raw HTML

    // Try to extract JSON from inside HTML body
    const match = text.match(/\{.*\}/s); // very basic JSON pattern
    if (!match) throw new Error("No JSON found in HTML response");

    const json = JSON.parse(match[0]);
    res.status(200).json(json);
  } catch (error) {
    console.error('Error fetching garden data:', error);
    res.status(500).json({ error: 'Failed to extract sensor data' });
  }
}
