import bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid'
import { db } from '../db/db.js';
import joi from "joi";


async function cadastroUser (req,res) {
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

}


async function loginUser(req, res) {
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

   const sessaoAberta= await db.collection("sessoes").findOne({_id: checkUser._id})


   if(sessaoAberta) {
    await db.collection("sessoes").updateOne({_id: checkUser._id}, 
      {$set: {token}} )
   }else{
    await db.collection("sessoes").insertOne({_id: checkUser._id, token })
   }

    return res.status(200).send({token, checkUser})

  } catch (error) {
    res.status(500).send(error.message)
  }
}

export { cadastroUser, loginUser };