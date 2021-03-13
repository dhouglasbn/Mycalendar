import express from "express";
import { router } from "./routes";
import "express-async-errors";

const app = express();

app.use(express.json()) // para o nodejs entender o JSON
app.use(router) // para conseguir realizar os processos com rotas

app.listen(3333, () => { console.log("Server is running!") });