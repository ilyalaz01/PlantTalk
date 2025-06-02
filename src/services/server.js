import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

app.get('/api/garden', async (req, res) => {
  try {
    const response = await fetch('https://gardenpi.duckdns.org/');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
