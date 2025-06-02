// File: /api/garden.js

export default async function handler(req, res) {
  try {
    const response = await fetch('https://gardenpi.duckdns.org');

    if (!response.ok) {
      throw new Error(`Remote gardenpi error: ${response.status}`);
    }

    const data = await response.json();

    // Validate expected structure
    if (
      typeof data.temperature?.value !== 'number' ||
      typeof data.humidity?.value !== 'number' ||
      typeof data.soil?.percent !== 'number'
    ) {
      throw new Error('gardenpi response missing expected fields');
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('[API ERROR] /api/garden:', error);
    res.status(500).json({ error: 'Failed to fetch data from gardenpi' });
  }
}
