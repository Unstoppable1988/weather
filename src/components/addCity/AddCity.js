import { useState } from "react";

import "./addCity.scss";

const AddCity = ({getCity, showError}) => {

    const [city, setCity] = useState("");

    const onSubmit = (e) => {
        getCity(e, city);
        setCity("")
    }

    return (
        <div className="addCityCont">
            <form className="addCity" onSubmit={(e) => onSubmit(e)}>
                <input type="text" name="city" placeholder="Type city here" value={city} onChange={(e) => setCity(e.target.value)}/>
                <input type="submit" value={"Add city"}/>
            </form>
            <p>{showError}</p>
        </div>
    )
}

export default AddCity;