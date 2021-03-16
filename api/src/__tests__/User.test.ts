import request from "supertest";
import connection from "../database/connections";
import { app } from "../app";
import { response } from "express";

describe("Users", () => {
    beforeAll(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    afterAll(async () => {
        await connection.destroy();
    })

    it("Should be able to create a user", async () => {
        const response = await request(app).post("/users").send({
            name: "dhouglas",
            email: "dhouglasbn@gmail.com"
        })
    })

    expect(response.status).toBe(200);
})