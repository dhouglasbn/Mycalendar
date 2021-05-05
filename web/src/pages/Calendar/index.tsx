import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import logo from "../../Assets/calendar2.svg";
import plus from "../../Assets/plus.svg";
import moment from "moment";

import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md"


const Calendar = () => {
    const [year, setYear] =useState(moment(new Date()).year())
    const [month, setMonth] = useState(moment(new Date()).month())
    const name = localStorage.getItem("name");
    
    // const email = localStorage.getItem("email");

    // array para mostrar o nome dos meses
    const monthNames = ["january",
                        "february",
                        "march",
                        "april",
                        "may",
                        "june",
                        "july",
                        "august",
                        "september",
                        "october",
                        "november",
                        "december"
                    ];

    useEffect(() => {
        const days = <div id="days"></div>
        ReactDOM.render(days, document.getElementById("calendar-body"))
        for (let i = 0; i <= 35; i++) {
            ReactDOM.render( 
                <h3></h3>, document.getElementById("days"))
            
        }

        
    }, [])

    function handleSubtractMonth() {
        if(month === 0) {
            setYear(year - 1);
            setMonth(11)
        } else {
            setMonth(month - 1);
        }
        
    }
    
    function handleAddMonth() {
        if(month === 11) {
            setYear(year + 1);
            setMonth(0);
        } else {
            setMonth(month + 1);
        }
    }

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
                            <MdKeyboardArrowLeft  
                            onClick={() => {handleSubtractMonth()}}
                            className="arrow"/>
                        </span>
                        <h3>{monthNames[month]}, {year}</h3>
                        <span >
                            <MdKeyboardArrowRight
                            onClick={() => {handleAddMonth()}} 
                            className="arrow"/>
                        </span>
                    </header>
                    <main id="calendar-body">
                        <div id="weekdays">
                            <h3>S</h3>
                            <h3>M</h3>
                            <h3>T</h3>
                            <h3>W</h3>
                            <h3>T</h3>
                            <h3>F</h3>
                            <h3>S</h3>
                        </div>
                        
                    </main>
                </div>
            </main>
        </div>
    )
}

export default Calendar