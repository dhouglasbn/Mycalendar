import { Knex } from "knex";

// minha tabela "users" vai conter:
// id | name | email

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("users", table => {
        table.increments("id").primary(),
        table.string("name").notNullable(),
        table.string("email").notNullable()
    })
}

// deletar a tabela users se for necessário

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users")
}

