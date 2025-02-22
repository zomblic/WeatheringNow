import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  tempF: number;
  humidity: number;
  windSpeed: number;
  icon: string;
  date?: string;
  city?: string;
  iconDescription?: string;
  constructor(
    tempF: number,
    humidity: number,
    windSpeed: number,
    icon: string,
    date?: string,
    city?: string,
    iconDescription?: string
  ) {
    this.tempF = tempF;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.icon = icon;
    this.date = date;
    this.city = city;
    this.iconDescription = iconDescription;
  }
}

// TODO: C TODO:omplete the WeatherService class
class WeatherService {
  // Define the baseURL, API key, and city name properties
  private baseURL: string = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}';
  private apiKey: string = 'f7d709975a885188553256b0f5f45';
  private cityName: string;

  // Fetch location data based on the city name
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const url = `${this.baseURL}${this.apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    const data = await response.json();
    if (data.length === 0) {
      throw new Error('No location data found');
    }
    const locationData = data[0];
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  // Fetch weather data based on coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const { lat, lon } = coordinates;
    const url = `${this.baseURL}${this.apiKey}&units=imperial`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();
    if (data.cod !== '200') {
      throw new Error('No weather data found');
    }
    return data;
  }

  // Parse current weather data
  private parseCurrentWeather(response: any): Weather {
    const { main, weather, wind } = response;
    const { temp, humidity } = main;
    const { speed } = wind;
    const { icon, description } = weather[0];
    return new Weather(temp, humidity, speed, icon, undefined, undefined, description);
  }

  // Build forecast array from weather data
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = [];
    for (let i = 0; i < weatherData.length; i++) {
      const { main, weather, wind, dt_txt } = weatherData[i];
      const { temp, humidity } = main;
      const { speed } = wind;
      const { icon, description } = weather[0];
      const forecast = new Weather(temp, humidity, speed, icon, dt_txt, undefined, description);
      forecastArray.push(forecast);
    }
    return forecastArray;
  }

  // Get weather for a city
  async getWeatherForCity(city: string): Promise<{ currentWeather: Weather; forecastArray: Weather[] }> {
    const coordinates = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
    return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
