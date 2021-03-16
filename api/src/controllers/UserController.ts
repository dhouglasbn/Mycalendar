import { Request, Response } from "express";
import knex from "../database/connections";
import { v4 as uuid } from "uuid";

class UserController {

    async create(request: Request, response: Response) {
        // gerando uma chave no formato uuid
        const id = uuid();
        // coleta de dados de nome e email
        const { name, email } = request.body;

        // tentando encontrar o email da requisição no banco de dados
        const emailAlreadyExists = await knex("users").select("email").where("email", email);

        // se não houver email ele retorna [], se houver email ele retorna um array de 1 item
        // logo se há um email meu código retorna erro
        if(emailAlreadyExists.length >= 1) {
            return response.status(401).json({"error": "Email already exists!"})
        }

        // inserindo os dados da requisição na minha tabela
        await knex("users").insert({id, name, email})

        // retornando uma resposta de status code 200
        return response.status(200).json({ name, email });
    }

    async logIn(request: Request, response: Response) {
        // coleta de dados da requisição
        const { name, email } = request.body;

        // tentando encontrar os dados no banco de dados
        const data = await knex("users").select("*").where("email", email);

        // se o email não foi encontrado o servidor retorna erro
        if(data.length < 1) {
            return response.status(404).json({"error": "this email does not exist!"})
        }

        // se o email foi encontrado mas há incongruências entre banco de dados e requisição
        // servidor retorna erro
        if (data[0].name != name) {
            return response.status(406).json({"error": "Wrong name"})
        }

        // retornando a tabela do usuário encontrado
        return response.json( data );
    }

}

export { UserController };