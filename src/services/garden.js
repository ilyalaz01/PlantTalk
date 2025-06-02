export default async function handler(req, res) {
  try {
    const response = await fetch('https://gardenpi.duckdns.org/');
    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch garden data' });
  }
}