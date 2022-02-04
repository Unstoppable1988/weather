import { useState } from "react";

import "./addCity.scss";

const AddCity = ({getCity, showError}) => {

    const [city, setCity] = useState("");

    return (
        <form className="addCity" onSubmit={(e) => getCity(e, city)}>
            <input type="text" name="city" placeholder="Type city here" value={city} onChange={(e) => setCity(e.target.value)}/>
            <input type="submit" value={"Add city"}/>
        </form>
    )
}

export default AddCity;