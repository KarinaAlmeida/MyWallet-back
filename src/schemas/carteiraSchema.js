import joi from "joi";
 

export const entradaSchema = joi.object({
    valor: joi.number().precision(2).required(),
    descrição: joi.string().required(),
  });