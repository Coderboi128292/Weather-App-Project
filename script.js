// Select DOM elements for user input, buttons, and display areas
const cityDataInput = document.querySelector(".city-data-input");
const searchButton = document.querySelector(".search-button");
const currentLocationButton = document.querySelector(".current-location-button");
const currentWeatherData = document.querySelector(".current-weather-data");
const weatherForecastCards = document.querySelector(".weather-forecast-cards");
const recentCitiesDropdown = document.createElement("select"); // Create a new dropdown element for recent cities
const API_KEY = "a8157f1fa35ec0e624c2395263e0b0f8"; // OpenWeatherMap API key

