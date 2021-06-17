import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import knex from "../database/connections";
import moment from "moment";
import { UserError } from "../errors/UserError";


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
        const user_id = await knex("users").select("id").where("email", email).first();

        // convertendo o formato da data da requisição para UTC
        const UTCStartDate = new Date(start_date).toISOString();
        const UTCFinishDate = new Date(finish_date).toISOString();

        try {
            // verificar se as datas estão no momento correto
            if(moment(UTCStartDate).isBefore(new Date()) || moment(UTCFinishDate).isBefore(new Date())) {
                throw new UserError("Incorrect data")
        }

            // verificar se a data de finish é posterior a data de start
            if(moment(UTCFinishDate).isBefore(moment(UTCStartDate))) {
                throw new UserError("Incorrect data")
            }
        } catch (err) {
            return response.status(err.statusCode).json({"message": `${err.message}`})
        }

        // armazenando todos os dados que vão para o banco de dados
        const data = {
            id,
            user_id: user_id.id,
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
        const { id, 
            title,
            start_date,
            finish_date,
            location,
            description } = request.body;

        const email = request.headers.email;

        // tentar encontrar o event no banco de dados
        const event = await knex("events").select("id").where("id", String(id)).first();

        // procurando o id do usuário logado para facilitar a busca do reminder
        const user_id = await knex("users").select("id").where("email", email).first();
        
        // convertendo os formatos das datas da requisição para o formato UTC
        const UTCStartDate = new Date(start_date).toISOString();
        const UTCFinishDate = new Date(finish_date).toISOString();


        
        try {
            // retornar erro caso não haja event
            if (!event) {
                throw new UserError("This event does not exists!")
            }

        
            // verificar se as datas estão no momento correto
            if(moment(UTCStartDate).isBefore(new Date()) || moment(UTCFinishDate).isBefore(new Date())) {
                throw new UserError("Incorrect data")
            }

            // verificar se a data de finish é posterior a data de start
            if(moment(UTCFinishDate).isBefore(moment(UTCStartDate))) {
                throw new UserError("Incorrect data")
            }

        } catch (err) {
            return response.status(err.statusCode).json({"message": `${err.message}`})
        }

        // atualizando os dados na database.sqlite
        await knex("events")
        .where("user_id", user_id.id)
        .where("id", String(id))
        .update({
            title: title,
            start_date: UTCStartDate,
            finish_date: UTCFinishDate,
            location: location,
            description: description
        });
        

        // retornando messagem de sucesso 
        return response.status(200).json({
            "message": "data updated successfuly"
        })
    }

    async delete(request: Request, response: Response) {
        // coleta de dados da requisição
        const { id } = request.params;
        const email = request.headers.email;

        // coletando dados de id nas tabelas de user e events para verificação
        const user = await knex("users").select("id").where("email", email).first();
        const user_id = await knex("events").select("user_id").where("id", id).first();

        try {
            // verificando se há event
            if(!user_id) {
                throw new UserError("This event does not exists!")
            }

            // verificando se a event pertence ao usuário da requisição
            if(user.id != user_id.user_id) {
                throw new UserError("Operation not permitted!")
            }
        } catch (err) {
            return response.status(err.statusCode).json({"message": `${err.message}`})
        }

        // tentando deletar meu evento na tabela events
        await knex("events").delete("*").where("id", String(id))
        
        // retornando mensagem de sucesso
        return response.status(200).json({
            "message": "Event deleted Successful!"
        })
    }
}

export { EventController }