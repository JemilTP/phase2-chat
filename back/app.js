
const express = require('express')
const http = require('http')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose= require("mongoose")
const Users_scheme = require("./user")
const Groups_scheme = require("./groups")
const uri = "mongodb://localhost:27017"
//app.use(express.urlencoded({entended: true}))
app.use(express.json())
app.set("view engine", "html")
//app.use(bodyParser.urlencoded({extended: false}))

const userRouter = require('./routes')
const { runMain } = require('module')
const { getUsers } = require('./functions')
mongoose.connect("mongodb://localhost:27017/chatdb")

app.use(cors())
app.set('port', process.env || 3000)
app.get('/lo', (req,res) => {
    res.send("HELLO")
})


app.post('/getUser', (req, res) => {
    let d = req
    console.log(d.body._id, "22")
    getUser()
    async function getUser(){
        try{
            const user = await Users_scheme.find({_id: req.body._id}).lean()
            console.log("got user: ",user)
            res.send(user[0])
           
        }catch{

        }
    }
})
app.post('/login', (req, res) => {
    //console.log(req, "00")
    auth()
    async function auth(){
    try{
        let user = await  Users_scheme.find({name: req.body.name, password: req.body.password}).lean()
       
        if (user.length != 0){
             console.log("User has logged in: ", user[0])
             res.send({_id: user[0]._id, role: user[0].role})
             
        }else{
            res.send([])
            console.log("wrong credentials")
            
        }
    }catch(e){
            console.log(e.message)
    }
    }
    
})

app.post('/getGroups',(req, res) => {
   let Groups = {groups: []}
    getGroup()
    async function getGroup(){
        try{
            for(let i in req.body)  {               
                const group = await Groups_scheme.find({name: req.body[i]}).lean()
                Groups.groups.push(group)
                console.log("group returned ", Groups)
                
            }
            res.send(Groups)
        }catch{

        }
    }
})


app.post('/groupAdmin/:username',(req, res) => {

    return
})
app.post('/groupAssis/:username',(req, res) => {

    return
})
app.post('/User/:username',(req, res) => {

    return
})
app.listen(3000)
