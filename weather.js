// weather.js
const axios = require('axios');
require('dotenv').config();
const getWeatherData = async () => {

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${process.env.api_key}`;
 
  try {
    const response = await axios.get(apiUrl);
  
    console.log(response.data);
  } catch (error) {
    console.error(`Error fetching weather data: ${error.message}`);
    throw error;
  }
};

module.exports = { getWeatherData };
