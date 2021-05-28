import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ReactDOM from "react-dom";
import "./styles.css";
import moment, { MomentInput } from "moment";
import api from "../../services/api";
import Modal from "@material-ui/core/Modal";
import Grow from "@material-ui/core/Grow";

import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { SiGooglecalendar } from "react-icons/si"
import { BsFillPlusCircleFill } from "react-icons/bs";

// tipagem dos dados de items
interface Item {
    id: string;
    user_id: string;
    type: string;
    title: string;
    date: string;
    start_date: string;
    finish_date: string;
    description: string;
    location: string;

}

const Calendar = () => {

    // usando o useHistory do react-router-dom
    const history = useHistory();

    // states que vão ser utilizadas na página: year, month e message
    const [referencedDate, setReferencedDate] = useState(moment().format("yyyy-MM-DD"));
    const [message, setMessage] = useState<String>("");
    const [items, setItems] = useState<Item[]>([]);
    const [openSelectorModal, setOpenSelectorModal] = useState<boolean>(false);
    const [openFormModal, setOpenFormModal] = useState<boolean>(false);

    // pegando o name que foi setado no localStorage durante o login
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");


    useEffect(() => {

        // fazendo requisição no banco de dados para receber todos os items do usuário logado
        // ao final de tudo, setar todos os reminders e events marcados por esse user em items
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
            
            // na array que irá ser passada, encontrar a hora do computador
            if (array.find(number => number === hour)) {

                // setando mensagem do turno da hora do computador
                setMessage(message);
            } else {
                return;
            }
        };

        // um desses 3 isInTurn irá retornar sua mensagem
        isInTurn([5,6,7,8,9,10,11], "Good morning");
        isInTurn([12,13,14,15,16,17], "Good afternoon");
        isInTurn([18,19,20,21,22,23,0,1,2,3,4], "Good evening");        

        
        
    }, [])

    useEffect(() => {

        // objeto responsável pelas marcações no calendário
        const CalendarVerifier = {
            // verificar se é mês atual
            isCurrentMonth: (date: MomentInput) => {
                if(moment(date).month() === moment(referencedDate).month()) {
                    return true;
                }
                return false;
                
            },
            // verificar se é o dia de hoje, se for
            isToday: (date: MomentInput) => {
                if(date === moment().format("yyyy-MM-DD")) {
                    return true;
                } else {
                    return false;
                }
            },
            // verificar se há lembretes no dia tal
            isReminderDay: (date: MomentInput) => {
                if (items.length > 0) {
                    const foundItem = items.find(item => moment(moment(item.date).local()).format("yyyy-MM-DD") === date
                    && item.type === "reminder")
                    if (foundItem) {
                        return true;
                    }
                    return false;
                }
                return false;
                
            },
            // verificar se há eventos que iniciam no dia tal, se houver
            isEventDay: (date: MomentInput) => {
                if (items.length > 0) {
                    const foundItem = items.find(item => (moment(moment(item.start_date).local()).format("yyyy-MM-DD") === date 
                    || moment(moment(item.finish_date).local()).format("yyyy-MM-DD") === date )
                    && item.type === "event")
                    if (foundItem) {
                        return true;
                    }
                    return false;
                }
                return false;
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
            
            // retornando cada elemento h3 que vai ser renderizado dentro de div#days
                return <button
                className="numberDays" 
                key={number}
                >

                    <h3 
                    style={{
                        backgroundColor: CalendarVerifier.isToday(monthDays[number]) ? "#00A4ED" : "",
                        border: CalendarVerifier.isReminderDay(monthDays[number]) ? "#00BD6D solid 4px" : "",
                        boxShadow: CalendarVerifier.isEventDay(monthDays[number]) ? "0.2px 0.2px 0px 5px #FF5D2F" : "",
                        color: CalendarVerifier.isCurrentMonth(monthDays[number]) ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.5)"
                    }}
                    id={moment(monthDays[number]).format("yyyy-MM-DD")}
                    
                >

                    {moment(monthDays[number]).format("DD")}
                </h3></button>;
            }
        );

        // renderizando days na div "days"
        ReactDOM.render( days, document.getElementById("days"));

    }, [referencedDate, items]);

    function openSelectItem() {
        setOpenSelectorModal(true)
    }

    function closeSelectItem() {
        setOpenSelectorModal(false)
    }

    function openForm() {
        setOpenFormModal(true)
    }

    function closeForm() {
        setOpenFormModal(false)
    }

    function handleLogOut() {
        localStorage.clear()

        history.push("/")
    }


    return (
        <div id="calendar-page">


            <header>
                <div id="salute">
                    <button onClick={handleLogOut} type="button">
                        <SiGooglecalendar size={100} color="rgba(255, 255, 255, 0.9)" />
                    </button>
                    <h3>{message} {name}!</h3>
                </div>

                
                <button
                onClick={openSelectItem} 
                id="plus-button" 
                type="button"
                >
                    <BsFillPlusCircleFill 
                    size={124} 
                    color="#00A4ED" 
                    style={{
                        backgroundColor: "#fff", 
                        padding: 0, 
                        borderRadius: 160
                        }} />
                </button>

                <Modal 
                open={openSelectorModal}
                onClose={closeSelectItem}
                aria-labelledby="event-button"
                >
                    <Grow in={openSelectorModal}>
                        <div id="selector">
                            <button 
                            onClick={() => {closeSelectItem();
                            openForm()}} 
                            id="event-button">Event</button>
                            <button id="reminder-button">Reminder</button>
                        </div>
                    </Grow>
                    

                </Modal>
                
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
                        <h3>{moment(referencedDate).format("MMMM")}, {moment(referencedDate).year()}</h3>
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
        
            <Modal 
            open={openFormModal}
            onClose={closeForm}
            aria-labelledby="form-header">
                <div id="form-content">
                    <header id="form-header">

                    </header>

                    <main id="form-main">

                    </main>
                </div>

            </Modal>
        </div>
    )
}

export default Calendar;