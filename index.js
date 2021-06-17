const express = require('express')
const Sequelize = require('sequelize')
require('./src/DB')
const bodyParser = require('body-parser')
const UserController = require('./src/Controllers/UserController')
const cors = require('cors')
const app = express()
const login_authorization = require('./src/middleware/auth')
const ConfigController = require('./src/Controllers/ConfigController')
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.post('/users', login_authorization, UserController.store)
app.post('/users/login', UserController.auth)
app.post('/usersList', login_authorization, UserController.list)
app.post('/configs', login_authorization, ConfigController.list)

app.get('/', ()=>{
  dsa
})
app.listen(3002, () => {
  console.log("runnig on port 3002")
})