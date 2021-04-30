import React, { ChangeEvent, FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../services/api";
import "./styles.css";

// await api.post("rota sem /", dados da requisição)

import logo from "../../Assets/calendar.svg";

const Home = () => {

    const history = useHistory()

    const [signValue, setSignValue] = useState("0");
    const [formData, setFormData] = useState({
        name: "",
        email: ""
    })

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({...formData, [name]: value})
        // pus name em array pra referenciar o name da target do event
    }

    function handleSelectedButton(buttonId: string) {
        const button = document.getElementById(buttonId)
        
        if(button?.className === "selected") {
            return;
        }
        if(signValue === "1") {
            setSignValue("0")
            return;
        }  
        setSignValue("1");
        return;
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        // iniciar sessão
        if (signValue === "0") {
            
            // coleta de dados do form
            const { name, email } = formData;

            try {
                await api.get("login", {data: {
                    "name": name,
                    "email": email
                }})

                localStorage.setItem("name", name);
                localStorage.setItem("email", email)

                history.push("/calendar")
            } catch (error) {
                alert(`falha ao registrar: ${error}`)
            }
        }
        // registrar
        if (signValue === "1") {
            // coleta de dados da requisição
            const { name, email } = formData;

            // criando objeto para inserir dados
            const data = new FormData();

            // inserindo dados
            data.append("name", name);
            data.append("email", email);

            try {
                await api.post("register", data)
                alert("email registrado com sucesso!");

                setSignValue("0");
            } catch (error) {
                alert(`Falha ao registrar: ${error}`);
            }
        }
    }

    return (
        <div id="home-page">
            <header id="home-page-header">
                <div id="logo">
                    <iframe className="logo" title="logo" src={logo} />
                    <h1>MyCalendar</h1>
                </div>
            </header>
            <main id="home-page-main">
                <form onSubmit={handleSubmit}>
                    <div id="form-header">

                        <button 
                        id="signUp" 
                        className={signValue === "0" ? "unselected" : "selected"} 
                        onClick={() => {handleSelectedButton("signUp")}}
                        type="button">Sign Up
                        </button>

                        <button 
                        id="signIn" 
                        className={signValue === "0" ? "selected" : "unselected"} 
                        onClick={() => {handleSelectedButton("signIn")}} 
                        type="button">Sign In
                        </button>

                    </div>
                    <div id="form-content">
                        <input 
                        type="text" 
                        name="name" 
                        id="nameI"
                        placeholder="Name"
                        onChange={handleInputChange}
                        />

                        <input 
                        type="text" 
                        name="email" 
                        id="emailI"
                        placeholder="Email"
                        onChange={handleInputChange}
                        />

                        <button id="form-content-button" type="submit">{signValue === "0"? "Sign In" : "Sign Up"}</button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default Home