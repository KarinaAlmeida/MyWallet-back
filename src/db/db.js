
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

//LIGANDO A APP AO BANCO DE DADOS----------------------------------------------------------------
const mongoClient = new MongoClient(process.env.DATABASE_URL);

try{
await mongoClient.connect()
console.log("banco conectado")

}catch (err) {
    console.log(err.message)
}
const db=mongoClient.db()

export { db }