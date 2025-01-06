
let map;
let marker;

function initMap(lat, lon) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        map.setView([lat, lon], 10);
    }

    if (marker) {
        marker.setLatLng([lat, lon]);
    } else {
        marker = L.marker([lat, lon]).addTo(map);
    }
}

async function showWeather() {
    const city = document.getElementById('city-input').value;
    if (!city) {
        alert('Please enter a city!');
        return;
    }

    const res = await fetch(`/weather?city=${city}`);
    const data = await res.json();

    if (data.error) {
        alert('City not found');
        return;
    }

    const { weather, rainVolume } = data;
    const { name, main, weather: weatherDetails, coord, countryCode } = weather;
    const { temp, feels_like, humidity, pressure } = main;
    const { description, icon } = weatherDetails;

    initMap(coord.lat, coord.lon);

    document.getElementById('weather-info').innerHTML = `
        <h3>Weather in ${name}, ${countryCode}</h3>
        <div class="weather-details">
            <p><strong>Temperature:</strong> ${temp}°C</p>
            <p><strong>Feels Like:</strong> ${feels_like}°C</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Pressure:</strong> ${pressure} hPa</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Rain Volume (last 3 hours):</strong> ${rainVolume} mm</p>
        </div>
        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}" class="icon"/>
    `;

    const newsContainer = document.getElementById('news-info');
    newsContainer.innerHTML = `<h3>Latest News about ${city}</h3>`;
    data.news.forEach(news => {
        newsContainer.innerHTML += `
            <div class="news-item">
                <a href="${news.url}" target="_blank">${news.title}</a>
                <p>${news.description}</p>
            </div>
        `;
    });
}