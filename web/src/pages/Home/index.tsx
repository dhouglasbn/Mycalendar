import React, { useState } from "react";
import "./styles.css";

import logo from "../../Assets/calendar.svg";

const Home = () => {

    const [signValue, setSignValue] = useState("0");

    function handleSelectedButton(buttonId: string) {
        const button = document.getElementById(buttonId)
        
        if(button?.className === "selected") {
            return;
        }
        if(signValue === "1") {
            setSignValue("0")
            return;
        }  
        setSignValue("1");
        return;
    }
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

                        <button 
                        id="signUp" 
                        className={signValue === "0" ? "unselected" : "selected"} 
                        onClick={() => {handleSelectedButton("signUp")}} 
                        type="button">Sign Up
                        </button>

                        <button 
                        id="signIn" 
                        className={signValue === "0" ? "selected" : "unselected"} 
                        onClick={() => {handleSelectedButton("signIn")}} 
                        type="button">Sign In
                        </button>

                    </div>
                    <div id="form-content">
                        <input type="text" name="nameN" id="nameI"/>
                        <input type="text" name="emailN" id="emailI"/>
                        <button id="form-content-button" type="submit">{signValue === "0"? "Sign In" : "Sign Up"}</button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default Home