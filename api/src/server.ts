import express from "express";
import { Request, Response } from "express";
import "express-async-errors";

const app = express();

app.get('/', (request: Request, response: Response) => {
    return response.json({
        "author": "Dhouglas Bandeira",
        "message": "Hello, World!"
    })
})

app.listen(3333);