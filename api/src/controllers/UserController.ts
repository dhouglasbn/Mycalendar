import { Request, Response } from "express";
import knex from "../database/connections";

class UserController {

    async create(request: Request, response: Response) {
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
        await knex("users").insert({name, email})

        // retornando uma resposta de status code 200
        return response.status(200).json({ name, email });
    }

}

export { UserController };