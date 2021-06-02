import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ReactDOM from "react-dom";
import "./styles.css";
import moment, { MomentInput } from "moment";
import api from "../../services/api";
import Modal from "@material-ui/core/Modal";
import Grow from "@material-ui/core/Grow";
import Slide from "@material-ui/core/Slide";
import { CalendarVerifier } from "../../services/CalendarService";

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

    const [formContent, setFormContent] = useState<JSX.Element>()

    const [reminderFormData, setReminderFormData] = useState({
        title: "",
        date: ""
    })
    // const [eventFormData, setEventFormData] = useState({
    //     title: "",
    //     start_date: "",
    //     finish_date: "",
    //     location: "",
    //     description: ""
    // })

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
                onClick={() => {
                    if( CalendarVerifier.isReminderDay(monthDays[number], items) || CalendarVerifier.isEventDay(monthDays[number], items)) {
                        openForm(2, monthDays[number])
                    }
                }}
                className="numberDays" 
                key={number}
                >
                    <h3 // estilizando cada item do calendário
                    style={{
                        backgroundColor: CalendarVerifier.isToday(monthDays[number]) ? "#00A4ED" : "",
                        border: CalendarVerifier.isReminderDay(monthDays[number], items) ? "#00BD6D solid 4px" : "",
                        boxShadow: CalendarVerifier.isEventDay(monthDays[number], items) ? "0.2px 0.2px 0px 5px #FF5D2F" : "",
                        color: CalendarVerifier.isCurrentMonth(monthDays[number], referencedDate) ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.5)"
                    }}
                    id={moment(monthDays[number]).format("yyyy-MM-DD")}>
                    {moment(monthDays[number]).format("DD")}
                </h3></button>;
            }
        );

        // renderizando days na div "days"
        ReactDOM.render( days, document.getElementById("days"));

    });

    function handleReminderInputChange(event: ChangeEvent<HTMLInputElement>) {
        // quando algo for acrescentado no input ....
        // atribuir nome e valor do target do event
        // ex: nome do name e valor que é o name q foi digitado, mas serve para o email tbm
        const { name, value } = event.target;

        console.log(name, value)
        // acrescentar em form data a letra q foi digitada tomando como referencia o nome(email ou name)
        setReminderFormData({ ...reminderFormData, [name]: value})

        console.log(reminderFormData)
        // pus name em array pra referenciar o name da target do event
    }

    // function handleEventInputChange(event: ChangeEvent<HTMLInputElement>) {
    //     // quando algo for acrescentado no input ....
    //     // atribuir nome e valor do target do event
    //     // ex: nome do name e valor que é o name q foi digitado, mas serve para o email tbm
    //     const { name, value } = event.target;

    //     // acrescentar em form data a letra q foi digitada tomando como referencia o nome(email ou name)
    //     setEventFormData({...eventFormData, [name]: value})
    //     // pus name em array pra referenciar o name da target do event
    // }

    function handleSubmitReminder(event: FormEvent) {
        event.preventDefault()

        const { title, date } = reminderFormData;

        const data = new FormData();

        data.append("title", title);
        data.append("date", date);

        console.log(data, email)
        try {
            api.post("remindme", data, {
                headers: {
                    email: email
                }
            }).then(response => {
                if(response.status === 200) {
                    alert("Reminder created!")

                    closeForm();
                } else {
                    alert("Error! Can't create a reminder!")
                }
            });
        } catch (error) {
            alert("Error! Can't create a reminder!")
        }
    }

    // abrir formulário, key para saber qual conteúdo deve ser renderizado, day para a listagem de itens
    function openForm(key: Number, day: MomentInput = "") {
        const contents = [

            // Criar reminder
            <div id="modal-form-content">
                <header id="modal-form-header">
                    <h2>Add a reminder</h2>
                </header>

                <main id="modal-form-main">

                    <fieldset id="form-inputs">
                        <input 
                        onChange={handleReminderInputChange}
                        type="text" 
                        name="title" id="titleI" 
                        className="white-box" 
                        placeholder="Remind me to..." 
                        required />

                        <input 
                        onChange={handleReminderInputChange}
                        type="datetime-local" 
                        name="date" 
                        id="dateI"
                        className="white-box" 
                        min={String(moment().format("YYYY-MM-DDTHH:mm"))} 
                        required />
                    </fieldset>

                    <button onClick={handleSubmitReminder} type="button" id="save-button" className="form-button"><p>Save</p></button>
                </main>
            </div>,

            // Criar evento
            <div id="modal-form-content">
                <header id="modal-form-header">
                    <h2>Add an event</h2>
                </header>
                <main id="modal-form-main">

                </main>
            </div>,

            // Listagem de lembretes e eventos de um dia
            <div id="modal-form-content">
                <header id="modal-form-header">
                    <h2>{moment(day).format("MMMM")}, {moment(day).format("DD")}</h2>
                </header>
                <main id="modal-form-main">

                </main>
            </div>,

            // Painel de um lembrete/evento
            <div id="modal-form-content">
                <header id="modal-form-header">
                    <h2>Info de 1 de junho</h2>
                </header>
                <main id="modal-form-main">

                </main>
            </div>
        ]

        setFormContent(contents[Number(key)])
        setOpenFormModal(true)
    }

    // retirando o conteúdo do formulário e fechando-o
    function closeForm() {
        setFormContent(<div id="modal-form-content"></div>)

        setOpenFormModal(false)
    }

    // limpando os atributos da local storage e voltando para a home
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
                onClick={() => {setOpenSelectorModal(true)}} 
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
                onClose={() => {setOpenSelectorModal(false)}}
                aria-labelledby="event-button"
                >
                    <Grow in={openSelectorModal}>
                        <div id="selector">
                            <button 
                            onClick={() => {setOpenSelectorModal(false)
                            openForm(1)}} 
                            id="event-button">Event</button>
                            <button onClick={() => {setOpenSelectorModal(false)
                            openForm(0)}} 
                            id="reminder-button">Reminder</button>
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
                <Slide
                direction="up"
                in={openFormModal}
                mountOnEnter
                unmountOnExit
                timeout={350}>
                {formContent}
                </Slide>

            </Modal>
        </div>
    )
}

export default Calendar;