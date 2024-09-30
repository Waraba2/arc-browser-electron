require('dotenv').config()
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const cors = require('cors');
app.use(cors());

const IFRAMELY_API_KEY = process.env.IFRAMELY_API_KEY;

app.get('/iframely', async (req, res) => {
  const { url } = req.query;

  try {
    const response = await axios.get('https://iframe.ly/api/iframely', {
      params: {
        url,
        api_key: IFRAMELY_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Iframely content' });
  }
});

app.get('/fetch-title', async (req, res) => {
  const { url } = req.query;

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const title = $('title').text();

    res.json({ title });
  } catch (error) {
    console.error('Error fetching page title:', error);
    res.status(500).json({ error: 'Failed to fetch page title' });
  }
});


app.listen(3001, () => {
  console.log('Proxy server is running on port 3001');
});
