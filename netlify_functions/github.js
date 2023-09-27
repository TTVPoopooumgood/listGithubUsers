// netlify-functions/github.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const query = event.queryStringParameters.q;
  const token = process.env.TOKEN1; // Replace with your GitHub token
  const apiUrl = `https://api.github.com/search/users?q=${query}+in:login&sort=followers&order=desc`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub users');
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data.items.slice(0, 15)), // Get the first 15 users
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
