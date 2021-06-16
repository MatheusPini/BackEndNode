const jwt = require('jsonwebtoken')
module.exports = (req, res, next)=>{
    const {token} = req.body
    try {
        const decode = jwt.verify(token, process.env.npm_package_env__PRIVATE_KEY)
        req.usuario = decode
        next()
    } catch (error) {       
        return res.json({message: "Falha na autenticação"})
    }
}