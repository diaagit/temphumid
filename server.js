const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'https://temphumid.netlify.app', // Replace with your Netlify domain
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));

// Middleware setup
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'about.html')));
app.get('/graphs', (req, res) => res.sendFile(path.join(__dirname, 'graphs.html')));

// Use an existing channel
app.post('/use-existing-channel', async (req, res) => {
    const fetch = await import('node-fetch').then(module => module.default);
    const apiKey = process.env.THING_SPEAK_API_KEY;
    const channelId = '2598475';
    const apiUrl = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json({ message: `Data fetched successfully!`, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
