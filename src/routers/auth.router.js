import express from "express";

import { cadastroUser, loginUser } from '../controllers/auth.controller.js';

const authRouter = express.Router();

//Colocar os Schemas separadamente com middleware
authRouter.post('/cadastro', cadastroUser);
authRouter.post('/', loginUser); 

export default authRouter;