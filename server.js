// server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

// Route to fetch the first 15 GitHub users
app.get('/search', async (req, res) => {
  const query = req.query.q; // Get the search term from the query parameter
  // GitHub API endpoint to get the first 15 users
  const githubApiUrl = `https://api.github.com/search/users?q=${query}+in:login&sort=followers&order=desc`;

  try {
    const response = await axios.get(githubApiUrl, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    if (response.status === 200) {
      const data = response.data;
      res.json(data.items.slice(0, 15)); // Send the first 15 users to the frontend
    } else {
      throw new Error('Failed to fetch GitHub users');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
