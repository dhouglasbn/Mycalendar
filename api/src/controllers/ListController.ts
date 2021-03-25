import { Request, Response} from "express";
import knex from "../database/connections";

interface ItemResponse {
    id: String;
}

class ListController {
    async index(request: Request, response: Response) {
        // coletando o email do usuário na requisição
        const email = request.headers.email;

        // buscando o id do meu usuário no banco de dados
        const user = await knex("users").select("id").where("email", email).first();

        // coletando todos os reminders que tem o user_id do meu usuário
        const reminders = await knex("reminders").select("*").where("user_id", user.id);

        // coletando todos os events que tem o user_id do meu usuário
        const events = await knex("events").select("*").where("user_id", user.id);

        // atribuir minhas reminders a data
        const data = reminders;

        // inserindo cada item de events ao final de data
        events.map(item => {data.push(item)});

        // retornando meus reminders
        return response.json(data);
    }

    async getOneItem(request: Request, response: Response) {
        // coleta de dados da requisição
        const { id , type } = request.query;
        const email = request.headers.email;

        // coletando a id do usuário logado
        const user_id = await knex("users").select("id").where("email", email).first();


        // procurando na tabela o reminder pelo id do user
        if(type == "reminder") {
            const item = await knex("reminders")
            .select("*")
            .where("user_id", user_id.id)
            .where("id", String(id));

            return response.status(200).json(item);
        };

        // procurando na tabela o event pelo id do user
        if(type == "event") {
            const item = await knex("events")
            .select("*")
            .where("user_id", user_id.id)
            .where("id", String(id));

            return response.status(200).json(item);
        }

    }
}

export { ListController }