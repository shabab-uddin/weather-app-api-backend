
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const searchButton = form.querySelector("button");
const statusMessage = document.getElementById("status");
const weatherCard = document.getElementById("weather-card");

const cityName = document.getElementById("city-name");
const description = document.getElementById("description");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const weatherIcon = document.getElementById("weather-icon");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    statusMessage.textContent = "Please enter a city name.";
    return;
  }

  searchButton.disabled = true;
  statusMessage.textContent = "Getting the latest weather...";
  weatherCard.hidden = true;

  try {
    const response = await fetch(
      `/api/weather?city=${encodeURIComponent(city)}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to get weather.");
    }

    cityName.textContent = `${data.city}, ${data.country}`;
    description.textContent = data.description;

    temperature.textContent = Math.round(data.temperature);
    feelsLike.textContent =
      `Feels like ${Math.round(data.feelsLike)}°C`;

    humidity.textContent = `${data.humidity}%`;
    windSpeed.textContent = `${data.windSpeed} m/s`;

    weatherIcon.src =
      `https://openweathermap.org/img/wn/${encodeURIComponent(data.icon)}@2x.png`;
    weatherIcon.alt = data.description;

    weatherCard.hidden = false;
    statusMessage.textContent = "Weather updated successfully.";
  } catch (error) {
    statusMessage.textContent = error.message;
  } finally {
    searchButton.disabled = false;
  }
});
