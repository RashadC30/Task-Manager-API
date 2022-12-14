const express = require("express")
require("./database/mongoose")
const { Model } = require('mongoose')
const hbs = require("handlebars")
const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app