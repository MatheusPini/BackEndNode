const jwt = require('jsonwebtoken')
const authJWT = require('../Config/authToken')
module.exports = (req, res, next)=>{
    const {token} = req.body
    try {
        const decode =jwt.verify(token, authJWT.secret)
        req.usuario = decode
        next()
    } catch (error) {
        return res.json({message: "Falha na autenticação"})
    }
}