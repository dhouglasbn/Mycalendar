import { Router } from "express";
import { UserController } from './controllers/UserController';

const router = Router();

const userController = new UserController;

router.post("/register", userController.create); // registrar usuário
router.get("/login", userController.logIn); // verificar e logar conta do usuário

export { router }