import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";

// import das classes dos controllers
import { UserController } from "./controllers/UserController";
import { ReminderController } from "./controllers/ReminderController";
import { EventController } from "./controllers/EventController";
import { ListController } from "./controllers/ListController";

const router = Router(); // usando as rotas do express

// instanciando classes
const userController = new UserController;
const reminderController = new ReminderController;
const eventController = new EventController;
const listController = new ListController; 

router.post("/register", celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email()
    })
})
, userController.create); // registrar usuário
router.get("/login", celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email()
    })
}),
userController.logIn); // verificar conta do usuário para login no frontend

router.post("/remindme", celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required(),
        date: Joi.string().required().isoDate()
    }),
    [Segments.HEADERS]: Joi.object({
        email: Joi.string().required().email()
    }).unknown()
})
,reminderController.create); // criar um remindme
router.post("/create", celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required(),
        start_date: Joi.string().required().isoDate(),
        finish_date: Joi.string().required().isoDate(),
        location : Joi.allow(),
        description: Joi.allow()
    }),
    [Segments.HEADERS]: Joi.object({
        email: Joi.string().required().email()
    }).unknown() 
})
, eventController.create); // criar um evento

router.put("/putreminder", celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required(),
        date: Joi.string().required().isoDate()
    }),
    [Segments.HEADERS]: Joi.object({
        email: Joi.string().required().email()
    }).unknown(),
    [Segments.QUERY]: {
        id: Joi.string().required().uuid()
    }
}), 
reminderController.modify) // alterar informações de um reminder
router.put("/putevent", eventController.modify) // alterar as informações de um event

router.delete("/delreminder/:id", reminderController.delete) // deletar um reminder
router.delete("/delevent/:id", eventController.delete) // deletar um event

router.get("/list", celebrate({
    [Segments.HEADERS]: Joi.object({
        email: Joi.string().required().email()
    }).unknown()
})
,listController.index); // coletando todos os events e reminders do meu user
router.get("/item", celebrate({
    [Segments.HEADERS]: Joi.object({
        email: Joi.string().required().email()
    }).unknown(),
    [Segments.QUERY]: {
        id: Joi.string().required().uuid(),
        type: Joi.string().required()
    }
})
,listController.getOneItem) // coletar um unico item


export { router }