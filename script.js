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

// Retrieve and display weather data for a given city name
const getWeatherDetails = async (cityName) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;
    const response = await fetch(WEATHER_API_URL);
    const data = await response.json();

    // Handle error if the weather data is not found
    if (data.cod !== "200") {
        throw new Error("Weather data not found for the specified location.");
    }

    const forecastDays = [];
    const filteredForecast = data.list.filter((item) => {
        const forecastDate = new Date(item.dt_txt).getDate();
        // Filter out duplicate forecast days
        if (!forecastDays.includes(forecastDate)) {
            forecastDays.push(forecastDate);
            return true;
        }
        return false;
    });

    // Clear previous weather data
    currentWeatherData.innerHTML = '';
    weatherForecastCards.innerHTML = '';

    // Display the main weather card
    currentWeatherData.innerHTML = createWeatherCard(cityName, filteredForecast[0], true);

    // Display the forecast weather cards
    filteredForecast.slice(1).forEach((forecast) => {
        weatherForecastCards.innerHTML += createWeatherCard(cityName, forecast, false);
    });

    // Add the city to the recent cities dropdown
    addCityToDropdown(cityName);
};

// Fetch weather data based on user's current location
const getWeatherByCoords = async (latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
    const response = await fetch(WEATHER_API_URL);
    const data = await response.json();

    // Handle error if the weather data is not found
    if (data.cod !== "200") {
        throw new Error("Weather data not found for your location.");
    }

    const cityName = data.city.name;
    const forecastDays = [];
    const filteredForecast = data.list.filter((item) => {
        const forecastDate = new Date(item.dt_txt).getDate();
        // Filter out duplicate forecast days
        if (!forecastDays.includes(forecastDate)) {
            forecastDays.push(forecastDate);
            return true;
        }
        return false;
    });

    // Clear previous weather data
    currentWeatherData.innerHTML = '';
    weatherForecastCards.innerHTML = '';

    // Display the main weather card
    currentWeatherData.innerHTML = createWeatherCard(cityName, filteredForecast[0], true);

    // Display the forecast weather cards
    filteredForecast.slice(1).forEach((forecast) => {
        weatherForecastCards.innerHTML += createWeatherCard(cityName, forecast, false);
    });

    // Add the city to the recent cities dropdown
    addCityToDropdown(cityName);
};

// Save recently searched cities to local storage and update the dropdown menu
const addCityToDropdown = (cityName) => {
    let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
    // Avoid duplicate entries in recent cities list
    if (!recentCities.includes(cityName)) {
        recentCities.push(cityName);
        localStorage.setItem("recentCities", JSON.stringify(recentCities));
    }
    updateDropdown();
};

// Populate the recent cities dropdown with stored city names
const updateDropdown = () => {
    let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
    recentCitiesDropdown.innerHTML = '<option value="">Select a recently searched city</option>';
    recentCities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        recentCitiesDropdown.appendChild(option);
    });

    // Append or remove the dropdown based on the availability of recent cities
    if (recentCities.length > 0) {
        document.querySelector(".weather-data-input").appendChild(recentCitiesDropdown);
    } else if (recentCitiesDropdown.parentElement) {
        recentCitiesDropdown.parentElement.removeChild(recentCitiesDropdown);
    }
};

// Handle city selection from the recent cities dropdown
recentCitiesDropdown.addEventListener("change", () => {
    if (recentCitiesDropdown.value) {
        getWeatherDetails(recentCitiesDropdown.value);
    }
});

// Fetch and display weather data based on user-entered city name
searchButton.addEventListener("click", async () => {
    const cityName = cityDataInput.value.trim();
    if (cityName) {
        try {
            const validCityName = await validateCity(cityName);
            await getWeatherDetails(validCityName);
        } catch (error) {
            alert(error.message);
        }
    } else {
        alert("Please enter a city name.");
    }
});
