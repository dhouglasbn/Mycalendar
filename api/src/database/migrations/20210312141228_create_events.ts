import { Knex } from "knex";

// minha tabela de events vai conter:
// id | user_id | name | description | date

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("events", table => {
        table.uuid("id").primary(),

        table.integer("user_id")
        .notNullable()
        .references("id")
        .inTable("users")

        table.string("name").notNullable(),
        table.string("description").notNullable(),
        table.string("date").notNullable()
    })
}

// deletar a tabela events se for necessário

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("events")
}

