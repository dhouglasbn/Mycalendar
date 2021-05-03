import React from "react";
import "./styles.css";
import logo from "../../Assets/calendar2.svg";
import plus from "../../Assets/plus.svg";

import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md"


const Calendar = () => {
    const name = localStorage.getItem("name");
    // const email = localStorage.getItem("email");

    return (
        <div id="calendar-page">


            <header>
                <div id="salute">
                    <iframe className="logo" src={logo} title="MyCalendar"></iframe>
                    <h3>Bom dia {name}!</h3>
                </div>
                
                <span id="plus-button">
                    <iframe id="plus" src={plus} title="AddItem"></iframe>
                </span>
                
            </header>


            <main>
                <div id="calendar">
                    <header id="calendar-header">
                        <span>
                            <MdKeyboardArrowLeft  className="arrow"/>
                        </span>
                        <h3>April</h3>
                        <span >
                            <MdKeyboardArrowRight className="arrow"/>
                        </span>
                    </header>
                    <main id="calendar-body">
                        
                    </main>
                </div>
            </main>
        </div>
    )
}

export default Calendar