//IMPORTS DAS BIBLIOTECAS ----------------------------------------------------------------
import express from 'express';
import cors from 'cors';

import authRouter from './routers/auth.router.js';
import transactionRouter from './routers/transaction.router.js';

//CONFIG E ATIVAÇÃO DAS BIBLIO----------------------------------------------------------------
const server = express();
server.use(cors());
server.use(express.json());


//CONECTANDO AO SERVIDOR----------------------------------------------------------------
server.listen(5000, () => {
    console.log(`Servidor rodando na porta: ${5000}`)
})



  server.use (authRouter);
  server.use (transactionRouter);