const express = require("express")
const flash = require("connect-flash")
const session = require("express-session")
require("dotenv").config()
const port = process.env.port || 7001
const secretKey = process.env.secret
const mongoose = require("mongoose")


const app = express()

const userRouter = require("./router/user")
const adminRouter = require("./router/admin")
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(express.static("public"))
  
app.set("view engine", "ejs")
app.set("views", "view")

app.use(flash())
app.use(session({
    secret : secretKey,
    resave : true,
    saveUninitialized : false
}))

app.use("/",userRouter)
app.use("/admin",adminRouter)   


mongoose.connect("mongodb://localhost:27017/E_commerce_project")
.then(()=>console.log("Database connected"))
.catch(()=>console.log("Database connection failed"))

app.listen(port,()=>console.log("All set to go...!",port))

  

