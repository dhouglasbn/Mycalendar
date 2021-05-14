import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import logo from "../../Assets/calendar2.svg";
import plus from "../../Assets/plus.svg";
import moment, { MomentInput } from "moment";
import api from "../../services/api";

import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

const Calendar = () => {
    // states que vão ser utilizadas na página: year, month e message
    const [referencedDate, setReferencedDate] = useState(moment().format("yyyy-MM-DD"));
    const [message, setMessage] = useState<String>("");
    const [items, setItems] = useState([])

    // pegando o name que foi setado no localStorage durante o login
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

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

        // fazendo requisição no banco de dados para receber todos os items do usuário logado
        api.get("list", {
            headers: {
                email: email
            }
        }).then(response => {
            setItems(response.data);
        })
        
    }, [email])
    
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

        const CalendarMarker = {
            isCurrentMonth: (date: MomentInput) => {
                if(moment(date).month() !== moment().month()) {
                    return "anotherMonth";
                } else {
                    return "currentMonth";
                }
            }
        }

        // primeiro dia do mes, no primeiro dia daquela semana
        const monthDay = moment(moment(referencedDate).startOf("month")).startOf("week")

        // fim do mes
        const monthEnd = moment(moment(referencedDate).endOf("month")).endOf("week")

        // criando uma array numbers
        const numbers = [];

        // criando a array de dias do mes
        const monthDays: Array<MomentInput> = []
        
        // inserindo 42 números dessa array
        for (let index = 0; index < 42; index++) {

            if (monthDay !== moment(monthEnd).add(1, "day")) {

                // adicionando o dia de monthDay à array monthDays
                monthDays.push(moment(monthDay).format("yyyy-MM-DD"));

                // adicionando 1 dia ao dia de monthDay
                monthDay.add(1, "day");
            }
            

            //  gerando os 42 itens de numbers para ser a referencia de componentes h3
            numbers.push(index)
        }

        // percorrendo cada item de numbers e atribuindo uma h3 para cada item a days
        const days = numbers.map(number => {

                return <h3 
                key={number}
                className={CalendarMarker.isCurrentMonth(monthDays[number])}
                >
                    {moment(monthDays[number]).format("DD")}
                </h3>;
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