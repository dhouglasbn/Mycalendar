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
        // paginação
        const {page = 1} = request.query;

        // coleta de dados da requisição
        const { date } = request.query;
        const email = request.headers.email;

        // buscar o id do usuário da requisição
        const user = await knex("users").where("email", email).select("id").first()

        // buscar no meu banco de dados todos os reminders que fazem parte daquele dia
        const reminders = await knex("reminders")
        .where("user_id", user.id)
        .where("date", "like", String(date + "%"))
        .select("*");

        // buscar no meu banco de dados todos os events que começam parte daquele dia
        const events = await knex("events")
        .where("user_id", String(user.id))
        .select("*");

        // atribuir minhas reminders a data
        const data = reminders;

        // em showItems é o que vai ser retornado no final
        const showItems = [];

        // inserindo cada item de events ao final de data
        events.map(item => { // pegando as datas, transferindo para data local,transformando para o formato conveniente, verificando
            if(moment(moment(moment(item.start_date).local()).format("yyyy-MM-DD")).isSameOrBefore(String(date)) && 
            moment(moment(moment(item.finish_date).local()).format("yyyy-MM-DD")).isSameOrAfter(String(date))) {
                data.push(item)
            }
        });

        // paginação
        data.map(item => {
            if(showItems.length < 5 && data.indexOf(item) >= (Number(page) - 1) * 5) {
                showItems.push(item)
            }
        })

        // retornando meus dados
        return response.json(showItems);

    }

    async getOneItem(request: Request, response: Response) {
        // coleta de dados da requisição
        const {id, type} = request.query;
        const email = request.headers.email;

        // coletando a user_id para meu código coletar apenas dados daquele user

        const user = await knex("users")
        .where("email", email)
        .select("id")
        .first()

        // escolhendo qual caminho eu vou seguir, se é pela tabela reminders  ou pela tabela events
        if(type === "reminder"){
            // buscar meu item no banco de dados
            const reminder = await knex("reminders")
            .where("user_id", user.id)
            .where("id", String(id))
            .select("*")
            .first();

            return response.status(200).json(reminder)
        }
        if(type === "event") {
            // buscar meu item no banco de dados
            const event = await knex("events")
            .where("user_id", user.id)
            .where("id", String(id))
            .select("*")
            .first();
            

            return response.status(200).json(event);
        }
    }
}

export { ListController }