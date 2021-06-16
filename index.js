const express = require('express')
const Sequelize = require('sequelize')
require('./src/DB')
const bodyParser = require('body-parser')
const UserController = require('./src/Controllers/UserController')
const cors = require('cors')
const app = express()
const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const login_authorization = require('./src/middleware/auth')
const db = mysql.createPool(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'systemschool',
  }
)
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/api/get', (req, res)=>{
  const sqlSelect = "select * from ss_tbl_login"
  db.query(sqlSelect, (err, result) => {
    res.send(result)
  })
})
// app.post('/api/insert', (req, res) =>{
   
//   const {login, senha} = req.body
//   const sqlInsert = "insert into SS_TBL_LOGIN(LOGIN, SENHA) values (?, ?)"
//   db.query(sqlInsert,[login, senha], (err, result) => {
//     return err ? err : result
//   })
// })
app.post('/api/auth', (req, res) => {
  const login = req.body.login
  const senha = req.body.senha
  const sqlAuth = "select * from SS_TBL_LOGIN where LOGIN = ? and SENHA = ?"
  db.query(sqlAuth, [login, senha], (err, result)=>{
    if(err !== null){
      return res.json({result: result, message: "erro"}).status(500)
    }
    if(result.length < 1){
      return res.json({result: result, message: "nao autorizado"}).status(401)
    }
    result.map((index)=>{
      const token = jwt.sign({
        ID: index.CODG_LOGIN,
        LOGIN: index.LOGIN,
        SENHA: index.SENHA
      }, process.env.npm_package_env__PRIVATE_KEY,
      {
        expiresIn: "1h"
      })
      return res.json({result: result, token: token}).status(200)
    })
  })
})
app.post('/users', login_authorization, UserController.store)
app.post('/users/login', UserController.auth)
app.get('/', (req, res)=>{
    res.send("teste")
})

app.listen(3002, () => {
  console.log("runnig on port 3002")
})