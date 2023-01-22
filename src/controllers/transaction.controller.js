import { db } from "../db/db.js";
import dayjs from 'dayjs'





async function novaEntrada (req, res) {
    
    const value= res.locals.value;
    const _id= res.locals.id;
  
    try {
  
      await db.collection("carteira").insertOne(
        {valor:value.valor, descrição:value.descrição, type:"entrada", userId:_id,  data: dayjs().format("DD/MM") })
      res.send("ok")
  
    } catch (err) {
      console.log(err)
      res.status(500).send("Deu algo errado no servidor")
    }
}



async function novaSaida (req, res) {
    const value= res.locals.value;
    const _id= res.locals.id;
  
    try {
    
      await db.collection("carteira").insertOne(
        {valor: value.valor, type:"saída", descrição: value.descrição, userId:_id,  data: dayjs().format("DD/MM") })
      res.send("ok")
  
    } catch (err) {
      console.log(err)
      res.status(500).send("Deu algo errado no servidor")
    }
}


async function getCarteira (req, res) {
   const _id= res.locals.id;
   
        try {

      const gastos = await db.collection("carteira").find({userId:_id}).toArray();

      if (!gastos) return res.sendStatus(401);
      
      return res.send(gastos)

        } catch (error) {
            return res.status(500).send(error.message);
        }
}

export {novaEntrada, novaSaida, getCarteira}