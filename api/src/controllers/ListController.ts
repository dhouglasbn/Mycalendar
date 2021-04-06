import { Request, Response} from "express";
import knex from "../database/connections";
import { UserError } from "../errors/UserError";

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

        // retornando meus dados
        return response.json(data);
    }

    async ListDayItems(request: Request, response: Response) {
        // coleta de dados da requisição
        const { date } = request.query;
        const email = request.headers.email;

        // buscar o id do usuário da requisição
        const user = await knex("users").where("email", email).select("id").first()

        // buscar no meu banco de dados todos os reminders que fazem parte daquele dia
        const reminders = await knex("reminders").where("user_id", user.id).where("date", String(date)).select("*");

        // buscar no meu banco de dados todos os events que fazem parte daquele dia
        const events = await knex("events").where("user_id", String(user.id)).where("start_date", String(date)).select("*");

        // atribuir minhas reminders a data
        const data = reminders;

        // inserindo cada item de events ao final de data

        events.map(item => {data.push(item)});

        // retornando meus dados
        return response.json(data);

    }
}

export { ListController }