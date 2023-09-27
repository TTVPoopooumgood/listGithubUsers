require('dotenv').config();
const searchBox = document.getElementById('search-box');
const suggestions = document.getElementById('suggestions');

async function fetchGitHubUsers(query) {
    // using personal access token need to make it private
    const token = process.env.TOKEN1;
    // const apiUrl = 'https://unique-flan-da8e8c.netlify.app/.netlify/functions/github?q=';
    const apiUrl = `https://api.github.com/search/users?q=${query}+in:login&sort=followers&order=desc`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `token ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.items.slice(0, 15); // Get the first 15 users
        } else {
            throw new Error('Failed to fetch GitHub users');
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function updateSuggestions() {
    const input = searchBox.value;
    const users = await fetchGitHubUsers(input);

    suggestions.innerHTML = '';

    users.forEach(user => {
        const listItem = document.createElement('li');
        listItem.textContent = user.login;
        suggestions.appendChild(listItem);
    });

    if (input === '') {
        suggestions.style.display = 'none';
    } else {
        suggestions.style.display = 'block';
    }
}

searchBox.addEventListener('input', updateSuggestions);
