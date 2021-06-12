const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const mysql = require('mysql')
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
  const re = db.query(sqlAuth, [login, senha], (err, result)=>{
    if(err !== null){
      return res.json({message: "erro"}).status(500)
    }
    if(result.length < 1){
      return res.json({message: "nao autorizado"}).status(401)
    }
    
    return res.json(result).status(200)
  })
  
})
app.get('/', (req, res)=>{
    res.send("teste")
})

app.listen(3002, () => {
  console.log("runnig on port 3002")
})