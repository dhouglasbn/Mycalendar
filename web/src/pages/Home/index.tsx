import React, { ChangeEvent, FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../services/api";
import "./styles.css";

// await api.post("rota sem /", dados da requisição)

import logo from "../../Assets/calendar.svg";

const Home = () => {

    /**
     * LEMBRAR
     * DE
     * APRENDER
     * A
     * TRABALHAR
     * COM
     * MODALS
     */

    // criando função para fzr a responsividade de páginas
    const history = useHistory();

    // states que serão usadas no código
    const [signValue, setSignValue] = useState("0");
    const [formData, setFormData] = useState({
        name: "",
        email: ""
    })

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        // quando algo for acrescentado no input ....
        // atribuir nome e valor do target do event
        // ex: nome do name e valor que é o name q foi digitado, mas serve para o email tbm
        const { name, value } = event.target;

        // acrescentar em form data a letra q foi digitada tomando como referencia o nome(email ou name)
        setFormData({...formData, [name]: value})
        // pus name em array pra referenciar o name da target do event
    }

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

    async function handleSubmit(event: FormEvent) {

        // tornar esse evento cancelável para evitar problemas
        event.preventDefault()

        // iniciar sessão
        if (signValue === "0") {
            
            // coleta de dados do form
            const { name, email } = formData;

            try {
                // fazendo requisição get no backend e passando os dados
                await api.get("login", {params: formData})

                // setando em localStorage name e email que vão ser utilizados na /calendar
                localStorage.setItem("name", name);
                localStorage.setItem("email", email)

                // empurrando o usuário para calendar
                history.push("/calendar")
            } catch (error) {
                // se por algum motivo ocorrer um erro, o usuário será alertado
                alert(`falha ao realizar login, tente novamente`)
            }
        }
        // registrar
        if (signValue === "1") {
            // coleta de dados da requisição
            const { name, email } = formData;

            // criando objeto com meus dados para requisição
            const data = {
                name,
                email
            }

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