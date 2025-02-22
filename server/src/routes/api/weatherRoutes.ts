import { Router, type Request, type Response } from 'express';
const router = Router();

 import HistoryService from '../../service/historyService.js';
 import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
app.POST('/api/weather', async (req: Request, res: Response) => {
  const { city } = req.body;
  const weatherData = await WeatherService.getWeatherData(city);
  res.json(weatherData);
}
  // TODO: GET weather data from city name
  app.GET('/api/weather/:city', async (req: Request, res: Response) => {
    const { city } = req.params;
    const weatherData = await WeatherService.getWeatherData(city);
    res.json(weatherData);
  }

  // TODO: save city to search history\
app.POST('/api/weather/history', async (req: Request, res: Response) => {
  const { city } = req.body;
  const historyData = await HistoryService.addCity(city);
  res.json(historyData);
}

// TODO: GET search history
app.GET('/api/weather/history', async (req: Request, res: Response) => {
  const historyData = await HistoryService.getCities();
  res.json(historyData);
}

// * BONUS TODO: DELETE city from search history
app.DELETE('/api/weather/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const historyData = await HistoryService.removeCity(id);
  res.json(historyData);
}

export default router;
