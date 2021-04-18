import React from "react";
import "./styles.css";
import logo from "../../Assets/calendar2.svg";
import plus from "../../Assets/plus.svg";


const Calendar = () => {
    return (
        <div id="calendar-page">


            <header>
                <div id="salute">
                    <iframe className="logo" src={logo} title="MyCalendar"></iframe>
                    <h3>Bom dia Dhouglas!</h3>
                </div>
                
                <span id="plus-button">
                    <iframe id="plus" src={plus} title="AddItem"></iframe>
                </span>
                
            </header>


            <main>
                <div id="calendar">
                    <header id="calendar-header">

                    </header>
                    <main id="calendar-body">
                        
                    </main>
                </div>
            </main>
        </div>
    )
}

export default Calendar