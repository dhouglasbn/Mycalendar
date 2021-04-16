import React from "react";
import "./styles.css";

import logo from "../../Assets/calendar.svg";

const Home = () => {
    return (
        <div id="headers">
            <div id="logo">
                <iframe title="logo" src={logo} />
                <h1>MyCalendar</h1>
            </div>
        </div>
    )
}

export default Home