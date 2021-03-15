import { Router } from "express";

import { UserController } from './controllers/UserController';
import { EventController } from "./controllers/EventController";

const router = Router();

const userController = new UserController;
const eventController = new EventController;

router.post("/register", userController.create); // registrar usuário
router.get("/login", userController.logIn); // verificar e logar conta do usuário

router.post("/create", eventController.create); // criar um evento

export { router }