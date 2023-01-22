

 export default function validateMiddle (entradaSchema) {
    
    return (req, res, next)=> {
        const {valor, descrição} = req.body
        const {error, value}= entradaSchema.validate ({valor, descrição})
        if (error) return res.status(422).send(error.message)  

        res.locals.value = value;
        next();
    }
}

