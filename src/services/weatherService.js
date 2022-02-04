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
            icon: `http://openweathermap.org/img/wn/${city.weather[0].icon}@4x.png`
        }
    }

    return {loading, error, getWeather, getWeathers, clearError}
}

export default useWeatherService;