import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_WEATHER_API_BASE_URL,
  headers: {
    'x-rapidapi-key': process.env.REACT_APP_WEATHER_API_KEY,
    'x-rapidapi-host': process.env.REACT_APP_WEATHER_API_HOST,
  },
});

export const getWeather = async (q = 96762) => {
  try {
    const response = await instance.get(`/forecast.json`, { params: { q } });
    // console.log(response.data);
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getSports = async (q = 96762) => {
  try {
    const response = await instance.get('/sports.json', { params: { q } });
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};
