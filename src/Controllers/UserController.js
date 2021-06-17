const User = require('../Models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authJWT = require('../Config/authToken')
const salt = bcrypt.genSaltSync(10)
module.exports = {
    async store(req, res){
        const {email, senha} = req.body
        let user
        if((senha && senha != "") && (email && email != "")){
            const senhaHash = bcrypt.hashSync(senha, salt)
            user = await User.create({email: email, senha: senhaHash})
            return res.json(user)
        }
        return res.json({user: user, message: "problema ao criar usuário"})
    },
    async auth(req, res){
        const {login, senha} = req.body
        if(!login || login ==""){
            res.json({message: "Informar E-mail"})
        }
        if(!senha || senha ==""){
            res.json({message: "Informar senha"})
        }
        const user = await User.findOne({email: login})
        const token = 1
        if(user){
            const validPassword = await bcrypt.compare(senha, user.senha)
            if(validPassword){
                const token = jwt.sign({
                    id: user.id,
                    email: user.email,
                    senha: user.senha
                }, authJWT.secret,
                {
                    expiresIn: authJWT.expireIn
                })
                return res.json({result: user, token: token, message: "Login efetuado com sucesso!"})
            }else{
                return res.json({result: null, token: token, message: "Falha na autenticação!"})
            }
        }else{
            return res.json({result: user, token: token, message: "Usuário não encontrado!"})
        }
    },
    async list(req, res){
        const users = await User.findAll()
        if(users.length > 0){
            return res.status(200).json({result: users, message: "autenticado"})
        }
        return res.status(401).json({
            result: users,
            message: "não autenticado"
        })
    }
}