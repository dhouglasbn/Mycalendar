import React from "react";
import "./styles.css";

import logo from "../../Assets/calendar.svg";

const Home = () => {
    return (
        <div id="home-page">
            <header id="home-page-header">
                <div id="logo">
                    <iframe className="logo" title="logo" src={logo} />
                    <h1>MyCalendar</h1>
                </div>
            </header>
            <main id="home-page-main">
                <form action="" method="get">
                    <div id="form-header">
                        <button id="unselected" type="button">Sign Up</button>
                        <button id="selected" type="button">Sign In</button>
                    </div>
                    <div id="form-content">
                        <input type="text" name="nameN" id="nameI"/>
                        <input type="text" name="emailN" id="emailI"/>
                        <button id="form-content-button" type="submit">Sign In</button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default Home