// Select DOM elements for user input, buttons, and display areas
const cityDataInput = document.querySelector(".city-data-input");
const searchButton = document.querySelector(".search-button");
const currentLocationButton = document.querySelector(".current-location-button");
const currentWeatherData = document.querySelector(".current-weather-data");
const weatherForecastCards = document.querySelector(".weather-forecast-cards");
const recentCitiesDropdown = document.createElement("select"); // Create a new dropdown element for recent cities
const API_KEY = "a8157f1fa35ec0e624c2395263e0b0f8"; // OpenWeatherMap API key

// Convert temperature from Kelvin to Celsius
const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);

// Generate HTML structure for weather cards based on the provided weather data
const createWeatherCard = (cityName, weatherData, isMainCard) => {
    const date = weatherData.dt_txt.split(" ")[0]; // Extract the date part from the datetime string
    const temperature = kelvinToCelsius(weatherData.main.temp); // Convert temperature to Celsius
    const windSpeed = weatherData.wind.speed; // Get wind speed
    const humidity = weatherData.main.humidity; // Get humidity level
    const icon = weatherData.weather[0].icon; // Get weather icon code
    const description = weatherData.weather[0].description; // Get weather description

    // Generate HTML for the main weather card
    if (isMainCard) {
        return`       
            <div class="weather-details">
                <h1 class="text-lg font-extrabold">${cityName} (${date})</h1>
                <h2 class="text-2x font-bold xl:text-lg">Temp: ${temperature} °C</h2>
                <h2 class="text-2x font-bold xl:text-lg">Wind: ${windSpeed} M/S</h2>
                <h2 class="text-2x font-bold xl:text-lg">Humidity: ${humidity}%</h2>
            </div>
            <div class="weather-image">
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather-image">
                <h2 class="text-lg font-extrabold">${description}</h2>
            </div>`;
    }

    // Generate HTML for forecast weather cards
    return `
        <li class="card text-white p-5 list-none w-52 xl:w-52 bg-blue-600 rounded">
            <h1 class="text-xl font-semibold">${date}</h1>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather-image">
            <h2 class="mt-2 font-medium">Temp: ${temperature} °C</h2>
            <h2 class="font-medium">Wind: ${windSpeed} M/S</h2>
            <h2 class="font-medium">Humidity: ${humidity}%</h2>
        </li>`;
};

// Validate if the city name exists using the Geocoding API
const validateCity = async (cityName) => {
    const GEO_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    const response = await fetch(GEO_API_URL);
    const data = await response.json();
    // Check if the city name is valid
    if (data.length > 0 && data[0].name.toLowerCase() === cityName.toLowerCase()) {
        return data[0].name;
    }
    throw new Error("City not found");
};

