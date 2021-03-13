import knex from "knex";
import path from "path";

const connection = knex({
    client: "sqlite3", // meu banco de dados vai ser o sqlite3
    connection: { // connectando com a database.sqlite
        filename: path.resolve(__dirname, "database.sqlite")
    },
    useNullAsDefault: true
})

export default connection;