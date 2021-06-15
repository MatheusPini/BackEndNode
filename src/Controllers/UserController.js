const User = require('../Models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
                }, process.env.npm_package_env__PRIVATE_KEY,
                {
                    expiresIn: "1h"
                })
                return res.json({result: user, token: token, message: "Login efetuado com sucesso!"})
            }else{
                return res.json({result: null, token: token, message: "Falha na autenticação!"})
            }
        }else{
            return res.json({result: user, token: token, message: "Usuário não encontrado!"})
        }
        // const auth = await User.findAll({
        //     where: {
        //         email: login,
        //         senha: senhaHash
        //     }
        // })
        // if(auth.length < 1){
        //     return res.json({result: auth, message: "nao autorizado"}).status(401)
        // }
        // auth.map((index)=>{
        //     const token = jwt.sign({
        //         id: index.id,
        //         email: index.email,
        //         senha: index.senha
        //     }, process.env.npm_package_env__PRIVATE_KEY,
        //     {
        //         expiresIn: "1h"
        //     })
        //     return res.json({result: auth, token: token}).status(200)
        // })
    }
}