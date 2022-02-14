import { useState, useEffect } from "react";
import useWeatherService from "../../services/weatherService";
import { Link } from "react-router-dom";

import AddCity from "../addCity/AddCity";
import Spinner from "../spinner/Spinner";

import "./weatherList.scss";

const WeatherList = () => {
    const {error, loading, getWeather, getWeathers, clearError} = useWeatherService();
    const [weather, setWeather] = useState([]);
    const [cityInList, setCityInList] = useState(false);

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
        clearError();
        getWeather(city)
        .then(addCity)
        .catch(e => console.log(e));
    }

    const addCity = (city) => {
        let localCities = JSON.parse(localStorage.getItem("cities"));
        if(localCities.find(el => el === city.id)) {
            setCityInList(true);
        } else {
            setCityInList(false);
            setWeather(weather => [...weather, city])
            localCities = [...localCities, city.id];
            localStorage.setItem("cities", JSON.stringify(localCities));
        }
    }

    const renderItems = (weather) => {
        if(weather.length > 0) {
            const items = weather.map(item => {
                return (
                    <div className="weatherItem" key={item.id}>
                        <Link to={`/city/${item.name}`}>
                            <div className="weatherItemTop" style={{"backgroundImage": `url(${item.icon})`}}>
                                <p>{item.name}</p>
                                <p>{item.weather}</p>
                            </div>
                            <div className="weatherItemBottom">
                                <p>Temperature: {item.temp} °С</p>
                                <p>Pressure: {item.pressure} MPA</p>
                                <p>Humidity: {item.humidity}%</p>
                            </div>
                        </Link>
                        <button className="deleteBtn" onClick={() => onDelete(item.id)}>X</button>
                    </div>
                )
            })
            return items;
        }
    }

    const cities = renderItems(weather);

    const errorMessage = error ? "There is no city with this name" : cityInList ? "City is already in the list" : null ;
    const spinner = loading ? <Spinner/> : null;

    return(
        <>
            <AddCity getCity={getCity} showError={errorMessage} />
            <div className="weatherList">
                {cities}
                {spinner}
            </div>
        </>
    )
}

export default WeatherList;