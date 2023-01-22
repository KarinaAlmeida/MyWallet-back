import { db } from "../db/db.js";

 export default function tokenValidate () {
    
    return async (req, res, next) => {
        
        const { authorization } = req.headers
        const token = authorization?.replace("Bearer ", '')

        if (!token) return res.status(422).send("Informe o token!")
        try{
        const temSessao = await db.collection("sessoes").findOne({ token })
 
  
        if (!temSessao) return res.status(401).send("Você não está logado! Entre antes de lançar dados!")

        res.locals.id= temSessao._id;
         next ();
        }catch (err){
        console.log(err)
        res.status(500).send("Deu algo errado no servidor")
        }
       

    }


 } 