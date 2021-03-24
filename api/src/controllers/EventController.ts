import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import knex from "../database/connections";
import moment from "moment";


class EventController {
    async create(request: Request, response: Response) {
        // gerar nossa chave uuid
        const id = uuid();
        // gerar tipo de item
        const type = "event"

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

        // verificar se as datas estão no momento correto
        if(moment(UTCStartDate).isBefore(new Date()) || moment(UTCFinishDate).isBefore(new Date())) {
            return response.status(401).json({
                "error": "this date is in the past!"
            })
        }

        // verificar se a data de finish é posterior a data de start
        if(moment(UTCFinishDate).isBefore(moment(UTCStartDate))) {
            return response.status(401).json({
                "error": "finish date must be after start date!"
            })
        }

        // armazenando todos os dados que vão para o banco de dados
        const data = {
            id,
            user_id,
            type,
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

    async modify(request: Request, response: Response) {
        // coletando dados da requisição
        const { title,
            start_date,
            finish_date,
            location,
            description } = request.body;

        const email = request.headers.email;
        const {id} = request.query;

        // procurando o id do usuário logado para facilitar a busca do reminder
        // desestruturando o id
        const userId = await knex("users").select("id").where("email", email);
        const user_id = userId[0].id;
        
        // convertendo os formatos das datas da requisição para o formato UTC
        const UTCStartDate = new Date(start_date).toISOString();
        const UTCFinishDate = new Date(finish_date).toISOString();

        // verificar se as datas estão no momento correto
        if(moment(UTCStartDate).isBefore(new Date()) || moment(UTCFinishDate).isBefore(new Date())) {
            return response.status(401).json({
                "error": "this date is in the past!"
            })
        }

        // verificar se a data de finish é posterior a data de start
        if(moment(UTCFinishDate).isBefore(moment(UTCStartDate))) {
            return response.status(401).json({
                "error": "finish date must be after start date!"
            })
        }

        // atualizando os dados na database.sqlite
        try {
            await knex("events")
            .where("user_id", user_id)
            .where("id", String(id))
            .update({
                title: title,
                start_date: UTCStartDate,
                finish_date: UTCFinishDate,
                location: location,
                description: description
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

export { EventController }