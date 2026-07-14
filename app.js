const weatherIcon = document.getElementById('weather-icon');
const weatherTemp = document.getElementById('weather-temp');
const weatherFeels = document.getElementById('weather-feels');
const weatherLocation = document.getElementById('weather-location');

const DEFAULT_LATITUDE = 40.7128;
const DEFAULT_LONGITUDE = -74.0060;
const DEFAULT_LOCATION = 'New York, NY';

function getWeatherEmoji(code) {
  if (code === 0) return '☀️';
  if ([1, 2, 3].includes(code)) return '🌤️';
  if ([45, 48].includes(code)) return '🌫️';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return '🌧️';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️';
  if ([95, 96, 99].includes(code)) return '⛈️';
  return '☁️';
}

function updateWeather(errorMessage) {
  if (!weatherTemp || !weatherFeels || !weatherLocation || !weatherIcon) return;

  weatherTemp.textContent = '--°F';
  weatherFeels.textContent = 'Feels like --°F';
  weatherLocation.textContent = errorMessage;
  weatherIcon.textContent = '🌦️';
}

async function loadWeather(lat, lon, locationLabel) {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code&temperature_unit=fahrenheit&timezone=auto`);

    if (!response.ok) {
      throw new Error('Weather request failed');
    }

    const data = await response.json();
    const current = data.current;
    const temperature = Math.round(current.temperature_2m);
    const feelsLike = Math.round(current.apparent_temperature);
    const condition = getWeatherEmoji(current.weather_code);
    const locationText = locationLabel || (data.timezone ? data.timezone.replace(/_/g, ' ') : 'Your location');

    weatherIcon.textContent = condition;
    weatherTemp.textContent = `${temperature}°F`;
    weatherFeels.textContent = `Feels like ${feelsLike}°F`;
    weatherLocation.textContent = locationText;
  } catch (error) {
    updateWeather('Weather unavailable');
  }
}

function requestWeather() {
  if (navigator.geolocation && window.location.protocol !== 'file:') {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadWeather(position.coords.latitude, position.coords.longitude, 'Your location');
      },
      () => {
        loadWeather(DEFAULT_LATITUDE, DEFAULT_LONGITUDE, DEFAULT_LOCATION);
      }
    );
  } else {
    loadWeather(DEFAULT_LATITUDE, DEFAULT_LONGITUDE, DEFAULT_LOCATION);
  }
}

requestWeather();
