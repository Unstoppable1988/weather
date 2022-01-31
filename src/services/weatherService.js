import {useHttp} from "../hooks/http.hook";

const useWeatherService = () => {
    const{loading, request, error, clearError} = useHttp(); 
    
    const _apiBase = "api.openweathermap.org/data/2.5/",
          _apiKey = "APPID=f701d605f33b457f5c3838c6ec2d7855";


    const getWeather = async (city) => {
        const res = await request(`${_apiBase}weather?${city}&${_apiKey}`);
        return res.data.results.map(_transformWeather)
    }

    const _transformWeather = (city) => {
        return {
            id: city.id,
            name: city.name,
            temp: city.main.temp,
            pressure: city.main.pressure,
            humidity: city.main.humidity,
            weather: city.weather.main
        }
    }

    return {loading, error, getWeather, clearError}
}

export default useWeatherService;