import { Request, Response } from "express";
import knex from "../database/connections";
import { v4 as uuid } from "uuid";


class ReminderController {
    async create (request: Request, response: Response) {
        // gerar minha chave uuid
        const id = uuid();

        // coleta de dados da requisição
        const { title, date } = request.body;
        const email = request.headers.email;

        // tentando encontrar o id do usuário do email no banco de dados
        const user = await knex("users").select("id").where("email", email)
        const user_id = user[0].id;

        // convertendo o formato da data da requisição para UTC
        const UTCDate = new Date(date).toISOString()

        // verificando se o reminder já existe
        const dateAlreadyExists = await knex("reminders").select("*").where("date", UTCDate);
        if(dateAlreadyExists.length >= 1) {
            return response.status(401).json({
                "error": "this reminder already exists!"
            })
        }

        // armazenando todos os dados que vão para o banco de dados
        const data = {
            id,
            user_id,
            title,
            date: UTCDate,

        }

        // inserindo minha data na tabela reminders
        await knex("reminders").insert(data);

        // retornando minha data 
        return response.json(data);
        

    }
}

export { ReminderController };