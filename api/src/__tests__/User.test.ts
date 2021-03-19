import request from "supertest";
import { response } from "express";
import { app } from "../app";
import connection from "../database/connections";

describe("User", () => {
    beforeEach(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    })

    afterAll(async () => {
        await connection.destroy()
    })

    it("Should be able to create a user", async () => {
        const response = await request(app)
        .post('/register')
        .send({
            "name": "user example",
            "email": "email@example.com"
        })
    })

    expect(response.status).toBe(200);
})
