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
    const [message, setMessage] = useState<String>("") 

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

        function isInTurn(array: Array<Number>, message: String) {
            // consultando a hora do computador assim que a página carregar
            const hour = moment(new Date()).hour();
            
            if (array.find(number => number === hour)) {
                setMessage(message);
            } else {
                return;
            }
        };

        isInTurn([5,6,7,8,9,10,11], "Good morning");
        isInTurn([12,13,14,15,16,17], "Good afternoon");
        isInTurn([18,19,20,21,22,23,0,1,2,3,4], "Good evening");        

        
        
    }, [])

    useEffect(() => {
        buildCalendar()
    });

    function buildCalendar() {

        // posição para inserir a weekday pra cada componente
        let weekDay = 0;

        // criando uma array numbers
        const numbers = [];

        // criando uma array para os 31 dias do mês em formato ISO
        const monthDays = [];

        function weekCounter() {
            

            // atribuindo um dia da semana pra cada componete
            if ( weekDay === 7 ) {

                // quando o dia chega em 7 o contador volta a 0
                weekDay = 0;
                weekDay++;
                return weekDay;
            } else {
                weekDay++;
                return weekDay;
            }
        } 
        
        // inserindo 42 números dessa array
        for (let index = 0; index < 42; index++) {

            // enquanto index for maior q 0 e menor q o numero de dias do mes
            if (index <= moment(month).daysInMonth() && index > 0 ) {

                // atribuir a day uma ISO com ano-mes-dia
                let day = `${year}-${month + 1}-${index}`;

                // adicionando esse dia a monthDays
                monthDays.push(new Date(day).toISOString());
            }
            // adicionando um numero a numbers
            numbers.push(index)
        }
        
        console.log(monthDays)

        // percorrendo cada item da array e atribuindo uma h3 para cada item a days
        const days = numbers.map(number => {
            const weekDay = weekCounter()
                return <h3 key={number} className={String(weekDay - 1)}>Day</h3>;
            }
        );
        
        // renderizando days na div "days"
        ReactDOM.render( days, document.getElementById("days"));
    };

    function handleSubtractMonth() {

        // uma simples lógica para aumentar o mês ao clicar na seta
        // se estivermos em dezembro o programa passa para o ano posterior e vai para janeiro
        if(month === 0) {
            setYear(year - 1);
            setMonth(11)
            buildCalendar()
        } else {
            setMonth(month - 1);
            buildCalendar()
        }
        
    }
    
    function handleAddMonth() {

        // uma simples lógica para reduzir o mês ao clicar na seta
        // se estivermos em janeiro o programa passa para o ano passado e vai para dezembero
        if(month === 11) {
            setYear(year + 1);
            setMonth(0);
            buildCalendar()
        } else {
            setMonth(month + 1);
            buildCalendar()
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