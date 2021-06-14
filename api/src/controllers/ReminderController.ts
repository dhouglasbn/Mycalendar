import { Request, Response } from "express";
import knex from "../database/connections";
import { v4 as uuid } from "uuid";
import moment from "moment";
import { UserError } from "../errors/UserError";


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
        const user = await knex("users").select("id").where("email", email).first();

        // convertendo o formato da data da requisição para UTC
        const UTCDate = new Date(date).toISOString()

        // verificando se o reminder já existe
        const dateAlreadyExists = await knex("reminders")
        .select("*")
        .where("user_id", user.id)
        .where("date", UTCDate);

        try {
            // verificar se a data da requisição é antecessora da data atual
            if(moment(UTCDate).isBefore(new Date())) {
                throw new UserError("Incorrect data")
            }

            // verificando se o reminder já foi registrado
            if(dateAlreadyExists.length >= 1) {
                throw new UserError("This reminder already exists!")
            }
        } catch (err) {
            return response.status(err.statusCode).json({"message": `${err.message}`})
        }  

        // armazenando todos os dados que vão para o banco de dados
        const data = {
            id,
            user_id: user.id,
            type,
            title,
            date: UTCDate,

        }

        // inserindo minha data na tabela reminders
        await knex("reminders").insert(data);

        // retornando minha data 
        return response.status(200).json(data);
        

    }

    async modify(request: Request, response: Response) {
        // coletando dados da requisição
        const { title, date, id } = request.body;
        const email = request.headers.email;

        // procurar o reminder no banco de dados
        const reminder = await knex("reminders").where("id", String(id)).select("id").first()

        // procurando o id do usuário logado para facilitar a busca do reminder
        const user = await knex("users").select("id").where("email", email).first();
        
        // convertendo o formato da data da requisição para UTC
        const UTCDate = new Date(date).toISOString()

        try {
            // retornando erro caso o reminder não exista
            if(!reminder) {
                throw new UserError("This reminder does not exists!")
            }

            // verificando se o momento da data faz sentido
            if(moment(UTCDate).isBefore(new Date().toISOString())) {
                throw new UserError("Incorrect data")
        }
        } catch (err) {
            return response.status(err.statusCode).json({"message": `${err.message}`})
        }

        // atualizando os dados na database.sqlite
        
        await knex("reminders")
        .where("user_id", user.id)
        .where("id", String(id))
        .update({
            title: title,
            date: UTCDate
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

        // coletando dados de id do usuário e user_id nas tabelas users e reminders
        const user = await knex("users").where("email", email).select("id").first();
        const user_id = await knex("reminders").where("id", id).select("user_id").first();

        try {
            if(!user_id) {
                throw new UserError("This reminder does not exists!")
            }

            // verificando se a reminder pertence ao meu user
            if(user.id != user_id.user_id) {
                throw new UserError("Operation not permitted!")
            }
        } catch (err) {
            return response.status(err.statusCode).json({"message": `${err.message}`})
        }
        

        // deletar meu reminder
        await knex("reminders").delete("*").where("id", id);

        // retornando mensagem de sucesso
        return response.status(200).json({"message": "reminder deleted successful!"})

    }
}

export { ReminderController };