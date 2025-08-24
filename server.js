const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data
let weatherData = [];
let currentId = 1;   // always starts at 1

// CREATE
app.post("/weather", (req, res) => {
  const newWeather = {
    forecastId: currentId++,
    location: req.body.location,
    date: req.body.date,
    temperature: req.body.temperature,
    humidity: req.body.humidity,
    condition: req.body.condition
  };
  weatherData.push(newWeather);
  res.status(201).json(newWeather);
});

// READ all
app.get("/weather", (req, res) => {
  res.json(weatherData);
});

// READ one by forecastId
app.get("/weather/:forecastId", (req, res) => {
  const weather = weatherData.find(w => w.forecastId === parseInt(req.params.forecastId));
  if (!weather) return res.status(404).json({ message: "Not found" });
  res.json(weather);
});

// UPDATE
app.put("/weather/:forecastId", (req, res) => {
  const weather = weatherData.find(w => w.forecastId === parseInt(req.params.forecastId));
  if (!weather) return res.status(404).json({ message: "Not found" });

  weather.location = req.body.location || weather.location;
  weather.date = req.body.date || weather.date;
  weather.temperature = req.body.temperature || weather.temperature;
  weather.humidity = req.body.humidity || weather.humidity;
  weather.condition = req.body.condition || weather.condition;

  res.json(weather);
});

// DELETE one
app.delete("/weather/:forecastId", (req, res) => {
  weatherData = weatherData.filter(w => w.forecastId !== parseInt(req.params.forecastId));

  // If all records deleted, reset ID back to 1
  if (weatherData.length === 0) {
    currentId = 1;
  }

  res.json({ message: "Deleted successfully" });
});

// DELETE all
app.delete("/weather", (req, res) => {
  weatherData = [];
  currentId = 1;  // reset ID
  res.json({ message: "All records deleted, forecastId reset to 1" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
