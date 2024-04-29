const express=require('express')
const app=express()
require('dotenv').config()



const Adminrouter=require('./router/routerapi')
const mongoose=require('mongoose')
mongoose.connect(`${process.env.DB_URl}/${process.env.DB_NAME}`)

// const uri = "mongodb+srv://sharewithcoder:jiPbDhTcdTkjeOyi@skjewel.7eyxgqj.mongodb.net/?retryWrites=true&w=majority&appName=SKjewel";
// mongoose.connect(uri)




const path=require('path')
app.use(express.json())
var cors=require("cors")
app.use(express.static('public'))
app.use(cors())
app.use('/skapi',Adminrouter)

const  _dirname= path.dirname("")
const buildpath=path.join(__dirname,"../front/build")
app.use(express.static('buildpath'))

app.listen(process.env.PORT,()=>{console.log(`Yeah! Great Micky Your Server is Runing on ${process.env.PORT}`)})