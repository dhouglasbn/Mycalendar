import React from "react";
import "./styles.css";

import logo from "../../Assets/calendar.svg";

const Home = () => {
    return (
        <div id="body">
            <header >
                <div id="logo">
                    <iframe title="logo" src={logo} />
                    <h1>MyCalendar</h1>
                </div>
            </header>
            <main>
                
            </main>
        </div>
    )
}

export default Home