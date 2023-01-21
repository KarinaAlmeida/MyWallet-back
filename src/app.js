//IMPORTS DAS BIBLIOTECAS ----------------------------------------------------------------
import express from 'express';
import cors from 'cors';
import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from 'uuid'
import dayjs from 'dayjs'


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
const {email, senha}= req.body;

const userLoginSchema = joi.object({
    email: joi.string().email().required(),
    senha: joi.string().required(),
  });
  const {error}= userLoginSchema.validate ({email, senha})
  if (error) return res.status(422).send(error.message)

  try {

    const checkUser = await db.collection('users').findOne({ email })

    if (!checkUser) return res.status(400).send("Usuário ou senha incorretos")

    const senhaCorreta = bcrypt.compareSync(senha, checkUser.senha)

    if (!senhaCorreta) return res.status(400).send("Usuário ou senha incorretos")
    
    const token = uuidV4();

    await db.collection("sessoes").insertOne({idUsuario: checkUser._id, token })

    return res.status(200).send({token, checkUser})

  } catch (error) {
    res.status(500).send(error.message)
  }
});


//ROTA DE NOVA ENTRADA ----------------------------------------------------------------
server.post('/nova-entrada', async (req, res) => {

    const {valor, descrição} = req.body
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", '')
    
  
    if (!token) return res.status(422).send("Informe o token!")
  
    const entradaSchema = joi.object({
        valor: joi.number().required(),
        descrição: joi.string().required(),
      });

      const {error}= entradaSchema.validate ({valor, descrição})
      if (error) return res.status(422).send(error.message)  
  
  
    try {
  
      const temSessao = await db.collection("sessoes").findOne({ token })
  
      if (!temSessao) return res.status(401).send("Você não está logado! Entre antes de lançar dados!")
    
      await db.collection("carteira").insertOne(
        {valor, descrição, idUsuario: temSessao.idUsuario,  data: dayjs().format("DD/MM") })
      res.send("ok")
  
    } catch (err) {
      console.log(err)
      res.status(500).send("Deu algo errado no servidor")
    }

})

//ROTA DE SAÍDA----------------------------------------------------------------
server.post('/nova-saida', async (req, res) => {

    const {valor, descrição} = req.body
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", '')
    
  
    if (!token) return res.status(422).send("Informe o token!")
  
    const saidaSchema = joi.object({
        valor: joi.number().required(),
        descrição: joi.string().required(),
      });

      const {error}= saidaSchema.validate ({valor, descrição})
      if (error) return res.status(422).send(error.message)  
  
  
    try {
  
      const temSessao = await db.collection("sessoes").findOne({ token })
  
      if (!temSessao) return res.status(401).send("Você não está logado! Entre antes de lançar dados!")
    
      await db.collection("carteira").insertOne(
        {valor, descrição, idUsuario: temSessao.idUsuario,  data: dayjs().format("DD/MM") })
      res.send("ok")
  
    } catch (err) {
      console.log(err)
      res.status(500).send("Deu algo errado no servidor")
    }

})


//ROTA HOME QUE MOSTRA A CARTEIRA
server.get ("/home", async (req, res) => {

    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", '')
    
  
    if (!token) return res.status(422).send("Informe o token!")



        try {
        const logado = await db.collection("sessoes").findOne({ token })
  
      if (!logado) return res.status(401).send("Você não está logado! Faça o login!")

      const gastos = await db.collection("carteira").find({idUsuario:(logado.idUsuario)}).toArray();

      if (!gastos) return res.sendStatus(401);
      
      return res.send(gastos)

        } catch (error) {
            return res.status(500).send(error.message);
        }
    })