import { useState, useEffect } from 'react';
import { getForecast, weatherConditionsData } from './data/data';
import { getWeather } from './api/apiManager';
import moment from 'moment';
import * as WiIcons from 'react-icons/wi';
import './styles/main.scss';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [IconComponent, setIconComponent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [ip, setIp] = useState(null);

  // get ip address
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => {
        setIp(data.ip);
        // console.log(`Client IP Address: ${clientIP}`);
      })
      .catch((error) => {
        console.error('Error fetching IP address:', error);
      });
  }, []);

  // fetch weather from api
  useEffect(() => {
    const getWeatherData = async () => {
      if (ip) {
        const fetchedData = await getWeather(ip);
        setWeather(fetchedData);
      }
    };
    getWeatherData();
  }, [ip]);

  // get icon after weather is fetched
  useEffect(() => {
    if (weather) {
      const iconObj = weatherConditionsData.find(
        (data) => data.code === weather.current.condition.code
      );
      setIconComponent(() => WiIcons[iconObj.reactIcon]);
      setForecast(weather.forecast.forecastday[0] ?? null);
      setLoading(false);
    }
  }, [weather]);

  return (
    <div className='App'>
      <div className='Weather'>
        <div className='wrapper'>
          <div className='content-container'>
            {loading ? (
              <div className='spinner'>Loading...</div>
            ) : (
              <div className='Weather-data'>
                <div className='current-hero'>
                  <div className='location'>
                    <p>
                      {weather.location.name}, {weather.location.region}
                    </p>
                    <p>{moment(new Date()).format('ddd MMM d, YYYY')}</p>
                  </div>
                  <div className='icon'>{IconComponent && <IconComponent />}</div>
                  <p className='condition'>{weather.current.condition.text}</p>
                  <p className='temp'>{roundNum(weather.current.temp_f)}&deg;F</p>
                </div>
                <dl className='weather-meta'>
                  <WeatherMetaBox
                    key='Wind'
                    label='Wind'
                    icon='WiStrongWind'
                    value={`${roundNum(weather.current.wind_mph)}mph`}
                  />
                  <WeatherMetaBox
                    key='Windir'
                    label='Wind Direction'
                    icon='WiWindDeg'
                    dataValue={weather.current.wind_degree}
                    value={`${weather.current.wind_degree}°${weather.current.wind_dir}`}
                  />
                  <WeatherMetaBox
                    key='Gusts'
                    label='Gusts'
                    icon='WiWindy'
                    value={`${roundNum(weather.current.gust_mph)}mph`}
                  />
                  <WeatherMetaBox
                    key='UV'
                    label='UV'
                    icon='WiDaySunny'
                    value={`${weather.current.uv}`}
                  />
                  <WeatherMetaBox
                    key='Sunrise'
                    label='Sunrise'
                    icon='WiSunrise'
                    value={forecast.astro.sunrise}
                  />
                  <WeatherMetaBox
                    key='Sunset'
                    label='Sunset'
                    icon='WiSunset'
                    value={`${forecast.astro.sunset}`}
                  />
                  <WeatherMetaBox
                    key='Humidity'
                    label='Humidity'
                    icon='WiHumidity'
                    value={forecast.day.avghumidity}
                  />
                  <WeatherMetaBox
                    key='Temp. High'
                    label='Temp. High'
                    icon='WiThermometerExterior'
                    value={`${roundNum(forecast.day.maxtemp_f)}°F`}
                  />
                  <WeatherMetaBox
                    key='Temp. Low'
                    label='Temp. Low'
                    icon='WiThermometer'
                    value={`${roundNum(forecast.day.mintemp_f)}°F`}
                  />
                </dl>
                <div className='forecast-hourly'>
                  {forecast.hour.map((hourly) => (
                    <HourlyForecast hourly={hourly} key={hourly.time_epoch} />
                  ))}
                </div>
                <div className='footer'>
                  <p>
                    Last Updated: {moment(weather.current.last_updated).format('MM/DD/YYYY HH:mmA')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const WeatherMetaBox = ({ label, icon, value, dataValue }) => {
  const IconComponent = WiIcons[icon] ?? null;
  return (
    <div className='Meta-box' data-label={label} data-value={dataValue && dataValue}>
      {IconComponent && <IconComponent />}
      <dt className='label'>{label}</dt>
      <dd className='value'>{value}</dd>
    </div>
  );
};

const HourlyForecast = ({ hourly }) => {
  const { time, temp_f, condition } = hourly;
  const iconObj = weatherConditionsData.find((data) => data.code === condition.code);
  const IconComponent = WiIcons[iconObj.reactIcon] ?? null;
  return (
    <div className='hourly'>
      <p className='time'>{moment(time).format('h:mmA')}</p>
      {IconComponent && <IconComponent />}
      <p className='time'>{condition.text}</p>
      <p className='time'>{roundNum(temp_f)}°F</p>
    </div>
  );
};

const roundNum = (num) => {
  return Math.round(Number(num));
};

export default Weather;
