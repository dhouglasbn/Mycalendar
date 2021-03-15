import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import knex from "../database/connections";


class EventController {
    async create(request: Request, response: Response) {
        // gerar nossa chave uuid
        const id = uuid();

        // coletar nossos dados da requisição
        const { title,
            start_date, 
            finish_date, 
            location, 
            description } = request.body;
        
        const email = request.headers.email;

        // tentando encontrar o id do usuário do email no banco de dados
        const user = await knex("users").select("id").where("email", email);
        const user_id = user[0].id;

        // convertendo o formato da data da requisição para UTC
        const UTCStartDate = new Date(start_date).toISOString();
        const UTCFinishDate = new Date(finish_date).toISOString();

        // armazenando todos os dados que vão para o banco de dados
        const data = {
            id,
            user_id,
            title,
            start_date: UTCStartDate,
            finish_date: UTCFinishDate,
            location,
            description
        }

        // inserir minha data no banco de dados
        await knex("events").insert(data);

        // retornando os dados
        return response.json(data);
    }
}

export { EventController }