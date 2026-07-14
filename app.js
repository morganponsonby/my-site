const weatherWidget = document.getElementById('weather-widget');
const weatherIcon = document.getElementById('weather-icon');
const weatherTemp = document.getElementById('weather-temp');
const weatherFeels = document.getElementById('weather-feels');
const weatherLocation = document.getElementById('weather-location');

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
  weatherTemp.textContent = '--°F';
  weatherFeels.textContent = 'Feels like --°F';
  weatherLocation.textContent = errorMessage;
  weatherIcon.textContent = '🌦️';
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code&temperature_unit=fahrenheit&timezone=auto`);

        if (!response.ok) {
          throw new Error('Weather request failed');
        }

        const data = await response.json();
        const current = data.current;
        const temperature = Math.round(current.temperature_2m);
        const feelsLike = Math.round(current.apparent_temperature);
        const condition = getWeatherEmoji(current.weather_code);
        const locationText = data.timezone ? data.timezone.replace(/_/g, ' ') : 'Your location';

        weatherIcon.textContent = condition;
        weatherTemp.textContent = `${temperature}°F`;
        weatherFeels.textContent = `Feels like ${feelsLike}°F`;
        weatherLocation.textContent = locationText;
      } catch (error) {
        updateWeather('Weather unavailable');
      }
    },
    () => {
      weatherIcon.textContent = '🌦️';
      weatherTemp.textContent = '--°F';
      weatherFeels.textContent = 'Feels like --°F';
      weatherLocation.textContent = 'I need your location to pull up the weather in your area :)';
    }
  );
} else {
  updateWeather('Geolocation not supported');
}
