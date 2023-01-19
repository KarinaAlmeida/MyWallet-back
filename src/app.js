//IMPORTS DAS BIBLIOTECAS ----------------------------------------------------------------
import express from 'express';
import cors from 'cors';
import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from "bcrypt";

//CONFIG E ATIVAÇÃO DAS BIBLIO----------------------------------------------------------------
const server = express();
dotenv.config();
server.use(cors());
server.use(express.json());
const PORT = 5000;

//LIGANDO A APP AO BANCO DE DADOS----------------------------------------------------------------
const mongoClient = new MongoClient(process.env.DATABASE_URL);

try{
await mongoClient.connect()
console.log("banco conectado")

}catch (err) {
    console.log(err.message)
}
const db=mongoClient.db()

//CONECTANDO AO SERVIDOR----------------------------------------------------------------
server.listen(5000, () => {
    console.log(`Servidor rodando na porta: ${5000}`)
})


//ROTA POST DE CADASTRO----------------------------------------------------------------
server.post('/cadastro', async (req, res) => {
    const user= req.body

    const userSchema = joi.object({
        nome: joi.string().required(),
        email: joi.string().email().required(),
        senha: joi.string().required(),
        confirmarSenha: joi.ref('senha'),
      });
      const {error}= userSchema.validate (user)
      if (error) return res.status(422).send(error.message)
      

      try {
        const emailCadastrado= await db.collection('users').findOne ({email: user.email})
        if (emailCadastrado) return res.status(400).send('Email já cadastrado! Tente novamente ou faça o Login!')

        const hash= bcrypt.hashSync(user.senha,10)
        delete user.confirmarSenha
        await db.collection('users').insertOne({...user, senha: hash});
        res.sendStatus(201);

      } catch (err) {
        return res.status(500).send(err.message);
      }

})

//ROTA DE LOGIN------------------------------------------------------------------------------------------------
server.post('/', async (req, res) => { 
const userLogin= req.body;

const userLoginSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    senha: joi.string().required(),
  });
  const {error}= userLoginSchema.validate (user)
  if (error) return res.status(422).send(error.message)


})