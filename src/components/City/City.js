import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import useWeatherService from "../../services/weatherService";
import Spinner from "../spinner/Spinner";

import "./city.scss";

const City = () => {
    const {loading, getWeather, getFullWeather} = useWeatherService();
    const [weather, setWeather] = useState();
    const params = useParams();

    useEffect(() => {
        onRequest();
    }, []);

    const onRequest = () => {
        getWeather(params.cityName)
        .then(getFullWeather)
        .then(onWeatherLoaded)
        .catch(e => console.log(e));
    }

    const onWeatherLoaded = (city) => {
        setWeather(city);
    }

    const setBackByTime = (city) => {
        if(city.current_time > city.sunrise && city.current_time < city.sunset) {
            return "day";
        }
        return "night";
    }

    const addZero = time => time < 10 ? `0${time}` : time;

    const convertTime = (timestamp) => {
        const date = new Date(timestamp * 1000 + weather.timezone_offset * 1000);
        return (`${addZero(date.getUTCHours())}:${addZero(date.getUTCMinutes())}:${addZero(date.getUTCSeconds())}`)
    }

    const convertWind = (degree) => {
        switch(true) {
            case degree < 24 || degree > 336:
                return "N↑";
            case degree > 23 && degree < 68:
                return "NE↗";
            case degree > 67 && degree < 114:
                return "E→";
            case degree > 113 && degree < 157:
                return "SE↘";
            case degree > 156 && degree < 204:
                return "S↓";
            case degree > 203 && degree < 247:
                return "SW↙";
            case degree > 246 && degree < 294:
                return "W←";
            case degree > 293 && degree < 337:
                return "NW↖";
            default:
                return "No wind"
        }
    }

    const renderHourly = (hourly, timezone) => {
        hourly = hourly.slice(0, 24);
        const temps = hourly.map(hour => {
            return(hour.temp);
        })
        const minTemp = Math.floor(Math.min(...temps)),
            maxTemp = Math.floor(Math.max(...temps)),
            average = (minTemp + maxTemp) / 2;

        const position = (temp) => {
            const avgMax = maxTemp - average,
                avgMin = average - minTemp;
                // temp = Math.floor(temp);
            if(temp > average) {
                console.log(temp);
                console.log(average);
                console.log(temp > average);
                const percents = (1 - (maxTemp - temp) / avgMax) * 50;
                return {transform: `translateY(-${percents}px)`};
            } else if(temp < average) {
                const percents = (1 - (temp - minTemp) / avgMin) * 50;
                return {transform: `translateY(${percents}px)`};
            }
        }

        const hourlyTemp = hourly.map((hour, i) => {
            console.log(hourly);
            const date = new Date(hour.dt * 1000 + timezone * 1000),
            hours = date.getUTCHours()
            return(
                <div 
                style={position(hour.temp)} 
                key={i}>
                    <span>{hour.temp > 0.99 ? "+" : null}
                    {Math.floor(hour.temp)} °C</span>
                    {addZero(hours)} H
                </div>
            )
        })
        return hourlyTemp;
    }

    const renderItem = (weather) => {
        if(weather) {
            return (
                <>
                <div className={`weatherCity ${setBackByTime(weather)}`}>
                    <p className="cityName">{params.cityName}</p>
                    <div className="topBlock">
                        <p>Sunrise: {convertTime(weather.sunrise)}</p>
                        <p className="weather">{weather.weather}</p>
                        <p>Sunset: {convertTime(weather.sunset)}</p>
                    </div>
                    <div className="midBlock">
                        <div className="left">
                            <p>Temperature: {weather.temp} °C</p>
                            <p>Feels like: {weather.feels} °C</p>
                        </div>
                        <div className="right">
                            <p>Wind speed: {weather.wind_speed} m/s</p>
                            <p>Wind direction: {convertWind(weather.wind_deg)}</p>
                        </div>
                    </div>
                    <div className="botBlock">
                        <p className="curTime">{convertTime(weather.current_time)}</p>
                        <p>Pressure: {weather.pressure} hPA</p>
                        <p>Humidity: {weather.humidity}%</p>
                    </div>
                    <img src={weather.icon} alt={weather.weather} />
                </div>
                <div className="hourly">
                    {renderHourly(weather.hourly, weather.timezone_offset)}
                </div>
                <Link to="/" className="backBtn">Go back</Link>
                </>
            )
        }
    }

    const renderCity = renderItem(weather);
    const spinner = loading ? <Spinner/> : null;
    
    return(
        <div>
            {spinner}
            {renderCity}
        </div>
    )
}

export default City;