import express, { NextFunction, Request, Response } from "express";
import { router } from "./routes";
import "express-async-errors";
import "reflect-metadata";
import { ServerError } from "./errors/ServerError";
import { UserError } from "./errors/UserError";
import { errors } from "celebrate";

const app = express();

// instanceof testa se há uma constructor em um objeto

app.use(express.json()) // para o nodejs entender o JSON
app.use(router) // para conseguir realizar os processos com rotas
app.use(errors()) // retornando os erros do celebrate

app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
    if(err instanceof ServerError) {
        return response.status(err.statusCode).json({
            message: err.message    
        })
    }
    if(err instanceof UserError) {
        return response.status(err.statusCode).json({
            message: err.message
        })
    }
})



export { app }
