// importando as ferramentas que vou usar nesse teste
import request from "supertest";
import { response } from "express";
import { app } from "../app";
import connection from "../database/connections";

describe("User", () => {
    // dando um rollback e rodando as migrations antes de testar
    beforeAll(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    })

    // derrubando a conexão após os testes
    afterAll(async() => {
        await connection.destroy();
    })
    
    // o objetivo é conseguir criar um usuário
    it("Should be able to create a user", async () => {
        // fazendo uma requisição nas minhas rotas para registrar um usuário
        const response = await request(app)
        .post('/register')
        .send({
            "name": "user example",
            "email": "email@example.com"
        })

        // espera-se que meu codigo retorne uma status code 200 (deu tudo certo)
        expect(response.status).toBe(200);
    })

    it("Should be able to verify a user", async() => {
        const response = await request(app)
        .get("/login")
        .send({
            "name": "user example",
            "email": "email@example.com"
        });

        expect(response.status).toBe(200);
    })

    
})
