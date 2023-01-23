

export default function validateUser (Schema) {
    
    return (req, res, next)=> {
        const {error}= Schema.validate (req.body)
        if (error) return res.status(422).send(error.message)
        next();
    }
}