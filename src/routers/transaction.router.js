import express from "express";

import {novaEntrada, novaSaida, getCarteira} from "../controllers/transaction.controller.js";
import validateMiddle from "../middlewares/validateMiddle.js";
import {entradaSchema} from "../schemas/carteiraSchema.js";
import tokenValidate from "../middlewares/tokenValidate.js";



const transactionRouter = express.Router();



transactionRouter.post('/nova-entrada',tokenValidate(), validateMiddle(entradaSchema), novaEntrada);
transactionRouter.post('/nova-saida', tokenValidate(),validateMiddle(entradaSchema), novaSaida);

transactionRouter.get('/home',tokenValidate(), getCarteira);

export default transactionRouter;
