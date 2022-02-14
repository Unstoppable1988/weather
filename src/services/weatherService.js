import {useHttp} from "../hooks/http.hook";

const useWeatherService = () => {
    const{loading, request, error, clearError} = useHttp(); 
    
    const _apiBase = "https://api.openweathermap.org/data/2.5/",
          _apiKey = "APPID=f701d605f33b457f5c3838c6ec2d7855",
          _defaultCities = [706483, 2950159, 3067696, 3143244, 1816670],
          localCities = localStorage.getItem("cities"),
          cities = localCities ? JSON.parse(localCities) : _defaultCities;

    if(!localCities) {
        localStorage.setItem("cities", JSON.stringify(_defaultCities))
    }
    
    const getWeather = async (city) => {
        const res = await request(`${_apiBase}weather?q=${city}&units=metric&${_apiKey}`);
        return _transformWeather(res);
    }

    const getFullWeather = async (city) => {
        const res = await request(`${_apiBase}onecall?lat=${city.lat}&lon=${city.lon}&exclude=minutely,daily&units=metric&${_apiKey}`);
        return _transformWeatherCity(res);
    }

    const getWeathers = async () => {
        const res = await request(`${_apiBase}group?id=${cities}&units=metric&${_apiKey}`);
        return res.list.map(_transformWeather)
    }

    const _transformWeather = (city) => {
        return {
            id: city.id,
            name: city.name,
            temp: Math.round(city.main.temp),
            pressure: city.main.pressure/10,
            humidity: city.main.humidity,
            weather: city.weather[0].main,
            icon: `http://openweathermap.org/img/wn/${city.weather[0].icon}@4x.png`,
            lon: city.coord.lon,
            lat: city.coord.lat
        }
    }

    const _transformWeatherCity = (city) => {
        return {
            temp: Math.round(city.current.temp),
            feels: Math.round(city.current.feels_like),
            sunrise: city.current.sunrise,
            sunset: city.current.sunset,
            timezone_offset: city.timezone_offset,
            current_time: city.current.dt,
            wind_speed: city.current.wind_speed,
            wind_deg: city.current.wind_deg,
            pressure: city.current.pressure/10,
            humidity: city.current.humidity,
            weather: city.current.weather[0].main,
            icon: `http://openweathermap.org/img/wn/${city.current.weather[0].icon}@4x.png`,
            hourly: city.hourly
        }
    }

    return {loading, error, getWeather, getFullWeather, getWeathers, clearError}
}

export default useWeatherService;