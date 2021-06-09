import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../services/api";
import "./styles.css";

import { Form } from "@unform/web";
import Input from "../../Components/Input";

// await api.post("rota sem /", dados da requisição)

import logo from "../../Assets/calendar.svg";

interface FormData {
    name: string;
    email: string;
}

const Home = () => {

    // criando função para fzr a responsividade de páginas
    const history = useHistory();

    // states que serão usadas no código
    const [signValue, setSignValue] = useState("0");

    function handleSelectedButton(buttonId: string) {
        // pegando a button do html(seja signIn ou signUp)
        const button = document.getElementById(buttonId)
        
        // se o botão já estiver selecionado nada vai acontecer
        if(button?.className === "selected") {
            return;
        }
        
        // lembrando q signValue começa como 0 ao carregar a página
        if(signValue === "1") {
            // depois de signValue ser alterado para um eu posso alterar para 0 novamente
            setSignValue("0")
            return;
        }  

        // o propósito é alterar para 1
        setSignValue("1");
        return;
    }

    async function handleSubmit(data: FormData) {

        // iniciar sessão
        if (signValue === "0") {
        

            try {
                // fazendo requisição get no backend e passando os dados
                await api.get("login", {params: data})

                // setando em localStorage name e email que vão ser utilizados na /calendar
                localStorage.setItem("name", data.name);
                localStorage.setItem("email", data.email)

                // empurrando o usuário para calendar
                history.push("/calendar")
            } catch (error) {
                // se por algum motivo ocorrer um erro, o usuário será alertado
                alert(`falha ao realizar login, tente novamente`)
            }
        }
        // registrar
        if (signValue === "1") {

            try {
                // fazendo requisição post no backend passando a minha data
                await api.post("register", data)

                // alertando o sucesso da requisição
                alert("email registrado com sucesso!");

                // retornando o usuário para o login
                setSignValue("0");
            } catch (error) {

                // se ocorrer algum erro, o usuário é alertado
                alert(`Falha ao registrar, tente novamente`);
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
                <Form onSubmit={handleSubmit}>
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
                        <Input 
                        type="text" 
                        name="name" 
                        id="nameI"
                        placeholder="Name"
                        />

                        <Input 
                        type="text" 
                        name="email" 
                        id="emailI"
                        placeholder="Email"
                        />

                        <button id="form-content-button" type="submit">{signValue === "0"? "Sign In" : "Sign Up"}</button>
                    </div>
                    
                </Form>
            </main>
        </div>
    )
}

export default Home