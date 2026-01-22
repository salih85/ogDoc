require('dotenv').config()

const connectDB = require('./config/db')
const express = require('express')
const port = process.env.PORT || 3000
const app = express()

app.listen(port,()=>{
    connectDB()
})