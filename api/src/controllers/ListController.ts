import { Request, response, Response} from "express";
import knex from "../database/connections";
import { UserError } from "../errors/UserError";
import moment from "moment";

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
        const reminders = await knex("reminders")
        .where("user_id", user.id)
        .groupBy("*")
        .orderBy("date", "asc")
        .having("date", "=", String(date))
        .select("*");

        // buscar no meu banco de dados todos os events que começam parte daquele dia
        const events = await knex("events")
        .where("user_id", String(user.id))
        .where("start_date", String(date))
        .select("*");

        console.log([date, email, user, reminders, events]);

        // atribuir minhas reminders a data
        const data = reminders;

        // inserindo cada item de events ao final de data

        events.map(item => {
            const startDate = item.start_date.substring(0, 10)
            const finishDate = item.finish_date.substring(0, 10)
            if(moment(startDate).isBefore(finishDate)) {
                data.push(item)
                data.push(item)
            }
            data.push(item)});

        // retornando meus dados
        return response.json(data);

    }

    async getOneItem(request: Request, reponse: Response) {
        // coleta de dados da requisição
        const {id, type} = request.params;
        const email = request.headers.email;

        // coletando a user_id para meu código coletar apenas dados daquele user

        const user = await knex("users")
        .where("email", email)
        .select("id")
        .first()

        // escolhendo qual caminho eu vou seguir, se é pela tabela reminders  ou pela tabela events
        if(type == "reminder"){
            // buscar meu item no banco de dados
            const reminder = await knex("reminders")
            .where("user_id", user.id)
            .where("id", String(id))
            .select("*");

            return response.status(200).json(reminder);
        }
        if(type == "event") {
            // buscar meu item no banco de dados
            const event = await knex("events")
            .where("user_id", user.id)
            .where("id", String(id))
            .select("*");

            return response.status(200).json(event);
        }
    }
}

export { ListController }