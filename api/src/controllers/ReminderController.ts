import { Request, Response } from "express";
import knex from "../database/connections";
import { v4 as uuid } from "uuid";
import "moment";
import moment from "moment";


class ReminderController {
    async create (request: Request, response: Response) {
        // gerar minha chave uuid
        const id = uuid();
        // gerar tipo de item
        const type = "reminder"

        // coleta de dados da requisição
        const { title, date } = request.body;
        const email = request.headers.email;

        // tentar encontrar o id do usuário do email no banco de dados
        const user = await knex("users").select("id").where("email", email)
        const user_id = user[0].id;

        // convertendo o formato da data da requisição para UTC
        const UTCDate = new Date(date).toISOString()

        // verificar se a data da requisição é antecessora da data atual
        if(moment(UTCDate).isBefore(new Date())) {
            return response.status(401).json({
                "error": "this date is in the past"
            })
        }

        // verificando se o reminder já existe
        const dateAlreadyExists = await knex("reminders").select("*").where("date", UTCDate);

        // armazenando todos os dados que vão para o banco de dados
        const data = {
            id,
            user_id,
            type,
            title,
            date: UTCDate,

        }

        // inserindo minha data na tabela reminders
        await knex("reminders").insert(data);

        // retornando minha data 
        return response.json(data);
        

    }

    async modify(request: Request, response: Response) {
        // coletando dados da requisição
        const { title, date } = request.body;
        const email = request.headers.email;
        const {id} = request.query;

        // procurando o id do usuário logado para facilitar a busca do reminder
        const userId = await knex("users").select("id").where("email", email);

        // desestruturando o id
        const user_id = userId[0].id;

        // convertendo o formato da data da requisição para UTC
        const UTCDate = new Date(date).toISOString()

        // verificando se o momento da data faz sentido
        if(moment(UTCDate).isBefore(new Date().toISOString())) {
            return response.status(400).json({
                "error": "this date is in the past!"
            })
        }

        // atualizando os dados na database.sqlite
        try {
            await knex("reminders")
            .where("user_id", user_id)
            .where("id", String(id))
            .update({
                title: title,
                date: UTCDate
        });
        } catch (error) {
            // retornando messagem de sucesso 
            return response.status(500).json({
                "error": "Something went wrong"
        })
        }
        

        // retornando messagem de sucesso 
        return response.status(200).json({
            "message": "data updated successfuly"
        })
    }
}

export { ReminderController };