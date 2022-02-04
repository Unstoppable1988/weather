import { useState, useEffect } from "react";
import useWeatherService from "../../services/weatherService";

import AddCity from "../addCity/AddCity";
import Spinner from "../spinner/Spinner";
import ErrorImg from "../errorImg/ErrorImg";

import "./weatherList.scss";

const WeatherList = () => {
    const {error, loading, getWeather, getWeathers} = useWeatherService();
    const [weather, setWeather] = useState([]);

    useEffect(() => {
        onRequest();
    }, []);

    const onRequest = () => {
        getWeathers()
        .then(onWeatherLoaded)
        .catch(e => console.log(e));
    }

    const onWeatherLoaded = (cities) => {
        setWeather(...weather, cities);
    }

    const onDelete = (id) => {
        setWeather(weather => weather.filter(item => item.id !== id));
        let localCities = JSON.parse(localStorage.getItem("cities"));
        localCities = localCities.filter(city => city !== id);
        localStorage.setItem("cities", JSON.stringify(localCities));
    }

    const getCity = (e, city) => {
        e.preventDefault();
        getWeather(city)
        .then(addCity)
        .catch(e => console.log(e));

    }

    const addCity = (city) => {
        setWeather(weather => [...weather, city])
        let localCities = JSON.parse(localStorage.getItem("cities"));
        localCities = [...localCities, city.id];
        localStorage.setItem("cities", JSON.stringify(localCities));
    }

    const renderItems = (weather) => {
        if(weather.length > 0) {
            const items = weather.map(item => {
                return (
                    <div className="weatherItem" key={item.id}>
                        <div className="weatherItemTop" style={{"backgroundImage": `url(${item.icon})`}}>
                            <p>{item.name}</p>
                            <p>{item.weather}</p>
                            <button onClick={() => onDelete(item.id)}>X</button>
                        </div>
                        <div className="weatherItemBottom">
                            <p>Temperature: {item.temp} °С</p>
                            <p>Pressure: {item.pressure} MPA</p>
                            <p>Humidity: {item.humidity}%</p>
                        </div>
                    </div>
                )
            })
            return items;
        }
    }

    const cities = renderItems(weather);

    const errorMessage = error ? <ErrorImg/> : null;
    const spinner = loading ? <Spinner/> : null;

    return(
        <>
            <AddCity getCity={getCity}/>
            <div className="weatherList">
                {errorMessage}
                {spinner}
                {cities}
            </div>
        </>
    )
}

export default WeatherList;