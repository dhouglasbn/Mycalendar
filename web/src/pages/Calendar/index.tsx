import React from "react";
import "./styles.css";
import logo from "../../Assets/calendar2.svg";
import plus from "../../Assets/plus.svg";


const Calendar = () => {
    return (
        <div id="body">


            <header>
                <iframe className="logo" src={logo} title="MyCalendar"></iframe>
                <h3>Bom dia Dhouglas!</h3>
                <span>
                    <iframe id="plus" src={plus} title="AddItem"></iframe>
                </span>
                
            </header>


            <main>

            </main>
        </div>
    )
}

export default Calendar