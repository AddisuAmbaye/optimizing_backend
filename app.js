// app.js
const express = require('express');
const cron = require('node-cron');
const { getWeatherData } = require('./weather');
const pool = require('./config/dbConnect');

const app = express();
const port = 3000;

// Schedule daily update at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Updating database with weather data...');
  const weatherData = await getWeatherData();
  await updateDatabase(weatherData);
  console.log('Database update complete.');
});

const updateDatabase = async (weatherData) => {
    const { city, country, temperature, humidity, sunset, sunrise, date } = weatherData;
  
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
  
    const [rows] = await pool.execute(sql, [city, country, temperature, humidity, sunset, sunrise, date]);
    console.log(`Inserted ${rows.affectedRows} row(s)`);
  };
  


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
