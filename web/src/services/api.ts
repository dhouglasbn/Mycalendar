import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3333/"
});

export default api;


// É possível fazer a conexão com o backend sem o axios
// porém o axios é uma biblioteca que facilita
// o processo e o deixa mais eficiente.