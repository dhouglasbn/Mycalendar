import express from "express";
import { router } from "./routes";
import "express-async-errors";
import "reflect-metadata";

const app = express();

app.use(express.json()) // para o nodejs entender o JSON
app.use(router) // para conseguir realizar os processos com rotas

export { app };