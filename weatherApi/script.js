// Replace with your OpenWeatherMap API key
const API_KEY = '634f0563f3c21b9c936962fa8f316aea';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const errorMessage = document.getElementById('errorMessage');

searchBtn.addEventListener('click', () => {
    const location = cityInput.value.trim();

    // console.log(location)
    if (location) {
        getWeatherData(location);
    }
});

// Fetch weather data
async function getWeatherData(location) {
    try {
        const response = await fetch(
            `${API_URL}?q=${location}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error('Location not found');
        }

        const data = await response.json();
        displayWeather(data);
        hideError();
    } catch (error) {
        showError('Unable to find weather data. Please check the location and try again.');
        weatherDisplay.classList.add('d-none');
    }
}

// Display weather data
function displayWeather(data) {
    const iconClass = 'bi-cloud-fill';

    document.getElementById('cityName').innerHTML = `${data.name}, ${data.sys.country}`;

    document.getElementById('weatherIcon').className = `weather-icon bi ${iconClass}`;

    document.getElementById('temperature').innerHTML = `${Math.round(data.main.temp)}°C`;

    document.getElementById('description').innerHTML = data.weather[0].description;

    document.getElementById('feelsLike').innerHTML = `${Math.round(data.main.feels_like)}°C`;

    document.getElementById('humidity').innerHTML = `${data.main.humidity}%`;

    document.getElementById('windSpeed').innerHTML = `${data.wind.speed} m/s`;

    document.getElementById('visibility').innerHTML = `${(data.visibility / 1000).toFixed(1)} km`;

    document.getElementById('pressure').innerHTML = `${data.main.pressure} hPa`;

    weatherDisplay.classList.remove('d-none');
}

// Error handling
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
}

function hideError() {
    errorMessage.classList.add('d-none');
}