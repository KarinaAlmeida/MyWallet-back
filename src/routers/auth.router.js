import express from "express";

import { cadastroUser, loginUser } from '../controllers/auth.controller.js';
import validateUser from "../middlewares/validateUser.js";
import {cadastroSchema, loginSchema} from "../schemas/authSchema.js";


const authRouter = express.Router();

authRouter.post('/cadastro', validateUser(cadastroSchema), cadastroUser);
authRouter.post('/',validateUser(loginSchema), loginUser); 

export default authRouter;