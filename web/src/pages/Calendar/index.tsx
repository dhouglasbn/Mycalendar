import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import logo from "../../Assets/calendar2.svg";
import plus from "../../Assets/plus.svg";
import moment from "moment";

import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md"


const Calendar = () => {
    // states que vão ser utilizadas na página: year, month e message
    const [referencedDate, setReferencedDate] = useState(`${moment(new Date()).year()}-${moment(new Date()).month() + 1}-01`)
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
        
        // referencia de total de dias do mes passado para inserção no previousMonthDays
        const lastMonthDays = moment(referencedDate).subtract(1, "months").daysInMonth()

        // dia da semana do primeiro de do mes atual para inserção em previousMonthDays
        const thisWeekDay = moment(referencedDate).weekday();

        // posição para inserir a weekday pra cada componente
        let weekDay = 0;

        // criando uma array numbers
        const numbers = [];

        // criando uma array para os 31 dias do mês em formato ISO
        const currentMonthDays = [];

        // criando uma array para os dias remanescentes do mes passado
        const previousMonthDays = [];

        // criando uma array para os dias remanescentes do mes que vem
        const nextMonthDays = [];

        function weekCounter() {
            

            // atribuindo um dia da semana pra cada componete
            if ( weekDay === 7 ) {

                // quando o dia chega em 7 o contador volta a 0
                weekDay = 0;
                weekDay++;
                return weekDay - 1;
            } else {
                weekDay++;
                return weekDay - 1;
            }
        } 
        
        // inserindo 42 números dessa array
        for (let index = 0; index < 42; index++) {

            // gerar a primeira array com itens do mes passado
            if (index < thisWeekDay) {
                previousMonthDays.push((lastMonthDays - (thisWeekDay - (index + 1))))
            }

            // gerar a segunda array com itens do mes atual
            if ( index <= moment(referencedDate).daysInMonth() && index > 0 ) {
                currentMonthDays.push(index);
            }

            // gerar a terceira array com itens do mes que vem
            if ( index >= (previousMonthDays.length + currentMonthDays.length) ) {
                nextMonthDays.push(index - (previousMonthDays.length + currentMonthDays.length) + 1);
            }


            //  gerando os 42 itens de numbers para ser a referencia de componentes h3
            numbers.push(index)
        }
        console.log(previousMonthDays);
        console.log(currentMonthDays);
        console.log(nextMonthDays);

        // percorrendo cada item de numbers e atribuindo uma h3 para cada item a days
        const days = numbers.map(number => {
            // usando um contador de dia da semana e atribuir a weekday e definir como classe da h3
            const weekDay = weekCounter();

            


                return <h3 key={number} className={String(weekDay)}>Day</h3>;
            }
        );
        
        // renderizando days na div "days"
        ReactDOM.render( days, document.getElementById("days"));

    });


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
                            onClick={() => { 
                                setReferencedDate(String(moment(referencedDate).subtract(1, "months"))) 
                            }}
                            className="arrow"/>
                        </span>
                        <h3>{monthNames[moment(referencedDate).month()]}, {moment(referencedDate).year()}</h3>
                        <span >
                            <MdKeyboardArrowRight
                            onClick={() => { 
                                setReferencedDate(String(moment(referencedDate).add(1, "months"))) 
                            }} 
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