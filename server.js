const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

const WEATHER_API_KEY = 'c1dbebe734b1e97a8b9b9bf6865b2658';
const NEWS_API_KEY = 'f9458cfbb2344948b2bb3cea68802551';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
        const weatherData = weatherResponse.data;

        const rainVolume = weatherData.rain ? weatherData.rain['1h'] : 0;

        const newsResponse = await axios.get(`https://newsapi.org/v2/everything?q=${city}&apiKey=${NEWS_API_KEY}`);
        const newsData = newsResponse.data.articles.slice(0, 5); 

        res.json({
            weather: {
                name: weatherData.name,
                main: weatherData.main,
                weather: weatherData.weather[0],
                coord: weatherData.coord,
                rainVolume: rainVolume,
                countryCode: weatherData.sys.country
            },
            news: newsData
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather or news data' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
