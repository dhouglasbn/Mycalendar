import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("reminders", table => {
        table.uuid("id").primary(),

        table.integer("user_id")
        .notNullable()
        .references("id")
        .inTable("users"),

        table.string("type").notNullable(),

        table.string("title").notNullable(),
        table.string("date").notNullable()
    } )
}


export async function down(knex: Knex): Promise<void> {
}

