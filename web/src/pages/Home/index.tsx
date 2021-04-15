import React from "react";
import "./styles.css";

import logo from "../../Assets/calendar.svg";

const Home = () => {
    return (
        <div id="headers">
            <div id="logo">
                <img src={logo} alt="MyCalendar"/>
                <h1>MyCalendar</h1>
            </div>
        </div>
    )
}

export default Home