import express from 'express';
import cors from 'cors';
import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import joi from "joi";

const server = express();
dotenv.config();
server.use(cors());
server.use(express.json());

const mongoClient = new MongoClient(process.env.DATABASE_URL);