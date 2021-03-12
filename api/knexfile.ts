// importando path para evitar bugs de diretórios
// windows usa \ e macOS usa /
import path from 'path';

module.exports = {
    client: "sqlite3", // definindo sqlite3 como o meu banco de dados
    connection: { // criando a conexão com o meu database.sqlite
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite')
    },
    migrations: { // criando minhas migrations na pasta migrations
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    useNullAsDefault: true
}