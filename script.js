document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("city-input");
    const getWeatherBtn = document.getElementById("get-weather-btn");
    const weatherInfo = document.getElementById("weather-info");
    const cityNameDisplay = document.getElementById("city-name");
    const temperatureDisplay = document.getElementById("temperature");
    const descriptionDisplay = document.getElementById("description");
    const errorMessage = document.getElementById("error-message");
    const citySuggestions = document.getElementById("city-suggestions");

    const API_KEY = "f992b5d4a4f5ca07690423dfd74bb1e8";

    cityInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            getWeatherBtn.click();
        }
    });

    cityInput.addEventListener("input", async () => {
        const query = cityInput.value.trim();
        if (query.length < 3) {
            citySuggestions.innerHTML = ""
            return;
        }

        try {
            const suggestions = await fetchCitySuggestions(query);
            displaySuggestions(suggestions);
        } catch (error) {
            console.error("Error fetching city suggestions:", error);
        }
    });

    async function fetchCitySuggestions(query) {
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch city suggestions");
        }
        return await response.json();
    }

    function displaySuggestions(suggestions) {
        citySuggestions.innerHTML = "";
        suggestions.forEach((city) => {
            const option = document.createElement("option");
            option.value = city.name + (city.state ? `, ${city.state}` : "") + `, ${city.country}`;
            citySuggestions.appendChild(option);
        });
    }

    getWeatherBtn.addEventListener("click", async () => {
        const city = cityInput.value.trim();
        if (!city) {
            weatherInfo.classList.add("hidden");
            errorMessage.classList.remove("hidden");
            return;
        }
        cityInput.value = "";

        weatherInfo.classList.add("hidden");
        errorMessage.classList.add("hidden");

        try {
            const data = await fetchWeatherData(city);
            displayWeatherData(data);
        } catch (error) {
            showError();
            throw new Error("City not found");
        }

        async function fetchWeatherData(city) {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("City not found");
            }
            const data = await response.json();
            console.log(data);
            return data;
        }

        function displayWeatherData(data) {
            const { name, main, weather } = data;
            cityNameDisplay.textContent = name;
            temperatureDisplay.textContent = `Temperature: ${Math.round(
                data.main.temp - 273.15
            )}°C`;
            descriptionDisplay.textContent = `Condition : ${data.weather[0].description.toLowerCase()}`;
            weatherInfo.classList.remove("hidden");
            errorMessage.classList.add("hidden");
        }

        function showError() {
            weatherInfo.classList.add("hidden");
            errorMessage.classList.remove("hidden");
        }
    });
});
