import { Request, Response} from "express";
import knex from "../database/connections";

class ListController {
    async index(request: Request, response: Response) {
        // coletando o email do usuário na requisição
        const email = request.headers.email;

        // buscando o id do meu usuário no banco de dados
        const user = await knex("users").select("id").where("email", email);
        const user_id = user[0].id;

        // coletando todos os reminders que tem o user_id do meu usuário
        const reminders = await knex("reminders").select("*").where("user_id", user_id);

        // coletando todos os events que tem o user_id do meu usuário
        const events = await knex("events").select("*").where("user_id", user_id);

        // atribuir minhas reminders a data
        const data = reminders;

        // inserindo cada item de events ao final de data
        events.map(item => {data.push(item)});

        // retornando meus reminders
        return response.json(data);
    }

    async getOneItem(request: Request, response: Response) {
        const { id, type } = request.params;

        if(type == "reminder") {
            const item = await knex("reminders").select("*").where("id", id);
            return response.status(200).json({item});
        }
        if(type == "event") {
            const item = await knex("events").select("*").where("id", id);
            return response.status(200).json({item});
        }

    }
}

export { ListController }