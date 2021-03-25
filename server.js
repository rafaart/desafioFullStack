require('dotenv').config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const pesquisasRotas = require('./rotas/pesquisas')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true  })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', (error) => console.log("conectado a base de dados"))

app.use(express.json())
app.use('/pesquisas', pesquisasRotas)

app.listen(3000, () => console.log("Servidor iniciado"))