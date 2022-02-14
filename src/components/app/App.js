import './App.scss';
import { Routes, Route, Link } from "react-router-dom";
import WeatherList from '../weatherList/WeatherList';
import City from '../City/City';

function App() {
  return (
    <div className="App">
      <div className="container">
        <Link to="/">
          <img src="https://hazards.colorado.edu/uploads/basicpage/NOAA.jpeg" alt="Banner" className="bannerImg" />
        </Link>
        <Routes>
          <Route path="/" element={<WeatherList />} />
          <Route path="/city/:cityName" element={<City />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
