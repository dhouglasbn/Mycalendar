import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import logo from "../../Assets/calendar2.svg";
import plus from "../../Assets/plus.svg";
import moment from "moment";

import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md"


const Calendar = () => {
    // states que vão ser utilizadas na página: year, month e message
    const [year, setYear] = useState(moment(new Date()).year())
    const [month, setMonth] = useState(moment(new Date()).month())
    const [message, setMessage] = useState("") 

    // pegando o name que foi setado no localStorage durante o login
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
    
    // alterando a mensagem de saudação de acordo com o horário do dia
    useEffect(() => {
        // cada mensagem a ser mostrada
        const messages = ["Good morning", "Good afternoon", "Good evening"]

        // consultando a hora do computador assim que a página carregar
        const hour = moment(new Date()).hour()

        // lógica básica de programação para setar a mensagem
        if (hour >= 6 && hour <= 12) {
            setMessage(messages[0]);
        } else if (hour >= 12 && hour <= 18) {
            setMessage(messages[1]);
        } else {
            setMessage(messages[2]);
        }
    }, [])

    useEffect(() => {

        // posição para inserir a weekday pra cada componente
        let weekDay = 0;

        // criando uma array numbers
        const numbers = [];

        // criando uma array para os 31 dias do mês em formato ISO
        const monthDays = [];
        
        // inserindo 42 números dessa array
        for (let index = 0; index < 42; index++) {
            if (index <= moment(month).daysInMonth() && index > 0 ) {
                let day = `${year}-${month + 1}-${index}`;
                monthDays.push(new Date(day).toISOString());
            }
            numbers.push(index)
        }

        // percorrendo cada item da array e atribuindo uma h3 para cada item a days
        const days = numbers.map(number => {
            if ( weekDay === 7 ) {
                weekDay = 0;
                weekDay++
                return <h3 key={number} className={String(weekDay - 1)}>{number}</h3>;
            } else {
                weekDay++
                return <h3 key={number} className={String(weekDay - 1)}>{number}</h3>
            }
        });
        
        // renderizando days na div "days"
        ReactDOM.render( days, document.getElementById("days"));

        
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

        // uma simples lógica para reduzir o mês ao clicar na seta
        // se estivermos em janeiro o programa passa para o ano passado e vai para dezembero
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
                    <h3>{message} {name}!</h3>
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
                        <div id="days">

                        </div>
                        
                    </main>
                </div>
            </main>
        </div>
    )
}

export default Calendar