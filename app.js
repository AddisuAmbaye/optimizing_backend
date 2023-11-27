// app.js
const express = require('express');
const cron = require('node-cron');
const { getWeatherData } = require('./weather');
const pool = require('./config/dbConnect');

const app = express();
const port = 3000;


// Schedule daily update at midnight
cron.schedule('*/2 * * * *', async () => {
  console.log('Updating database with weather data...');
  const weatherData = await getWeatherData();
  await updateDatabase(weatherData);
  console.log('Database update complete.');
});

const updateDatabase = async (weatherData) => {
  const { name: city, sys: { country }, main: { temp: temperature, humidity }, sys: { sunset, sunrise } } = weatherData;

  // Convert sunset and sunrise to MySQL DATETIME format
  const sunsetDate = new Date(sunset * 1000).toISOString().slice(0, 19).replace('T', ' ');
  const sunriseDate = new Date(sunrise * 1000).toISOString().slice(0, 19).replace('T', ' ');
  const currentDate = new Date(weatherData.dt * 1000).toISOString().slice(0, 19).replace('T', ' ');

  const sql = `
    INSERT INTO weather_data (city, country, temperature, humidity, sunset, sunrise, date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    temperature = VALUES(temperature),
    humidity = VALUES(humidity),
    sunset = VALUES(sunset),
    sunrise = VALUES(sunrise),
    date = VALUES(date)
  `;

  const [rows] = await pool.execute(sql, [city, country, temperature, humidity, sunsetDate, sunriseDate, currentDate]);
  console.log(`Inserted ${rows.affectedRows} row(s)`);
};

  


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
