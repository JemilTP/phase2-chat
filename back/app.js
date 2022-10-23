
const express = require('express')

const app = express()
const http = require('http').Server(app)

const io = require('socket.io')(http, {
    cors: {
        orgin: '*'
    }
})

io.on('connection', function (socket)  {

    socket.on('message', (msg) =>{
        console.log('message: ', msg)
        socket.broadcast.emit("message-sent", msg)
        updateChat()
        async function updateChat(){
            try{
                    console.log("rooms: ", msg.group.rooms)
                    await Groups_scheme.updateOne({name: msg.group.name}, {$set: {rooms: msg.group.rooms}})
              
            }catch{

            }
        }
      
    })
    socket.on('getAllUsers', (s) => {
        getAllUsers()
        async function getAllUsers(){
            try{
                let allUsers = await Users_scheme.find().lean()
                socket.emit('returnAllUsers', {allUsers: allUsers})
            }catch{

            }
        }
    })
    socket.on('getGroup', (msg) => {
       // socket.broadcast.emit('roomChange', {group: "dddssss"})
        getGroup()
        
        async function getGroup(){
            try{
                let group = await Groups_scheme.find({name: msg.groupName}).lean()
                console.log(group[0])
                 socket.emit('roomChange', {group: group[0], roomName: msg.roomName, userName: msg.userName})
            }catch{

            }
        }
    })

    socket.on('createGroup', (group) => {
        io.emit('newGroup', {name: group.groupName, members: [], rooms: []})
        addGroup()
        async function addGroup(){
            try{
                let newGroup = new Groups_scheme()
                newGroup.name = group.groupName
                
                newGroup.save()
                
                console.log('new group: ', newGroup)
            }catch{

            }
        }
    })
    socket.on('deleteGroup', (group) => {
        deleteGroup()
        async function deleteGroup(){
            try{
                await Groups_scheme.deleteOne({name: group.groupName})
            }catch{

            }
        }
    })
    socket.on('newUser', (user) => {
        addUser()
        async function addUser(){
            try{
                let newUser = new Users_scheme()
                newUser.name = user.name
                newUser.password = user.password;
                newUser.email = user.email
                newUser.role = user.role
                newUser.Groups = user.Groups
               newUser.save()
            }catch{

            }
        }
    })
    socket.on('deleteUser', (user) =>{
        deleteUser()
        console.log('delete', user)
        async function deleteUser(){
            try{
                 await Users_scheme.deleteOne({name: user.userName})
                
            }catch{

            }
        }
    })
    socket.on('changeUserRole', (user) => {
        changeUserRole()
        async function changeUserRole(){
            try{
                    await Users_scheme.updateOne({name: user.userName}, {$set:{role: user.role}})
            }catch{

            }
        }
    })
    socket.on('checkUser', (user) => {
        checkUser()
        console.log('kkk')
        async function checkUser(){
            try{
                let ret = await Users_scheme.find({name: user.userName}).lean()
               console.log(ret)
                if(ret.length != 0){
                     io.emit('userChecked', {userExists: true})
                }else{
                    io.emit('userChecked', {userExists: false})
                }
            }catch{

            }
        }
    }) 
    
})
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose= require("mongoose")
const Users_scheme = require("./user")
const Groups_scheme = require("./groups")
const uri = "mongodb://localhost:27017"

app.use(express.json())
app.set("view engine", "html")


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

app.post('/getGroup',(req, res) => {
    let groups = []
    getGroup()
    async function getGroup(){

        try{    
            if (req.body.groups != ""){
                    for(let i in req.body.groups){
                        groups.push((await Groups_scheme.find({name: req.body.groups[i]}).lean())[0])
                    
                    }
                    res.send(groups)
                    console.log("groups returned ", groups, req.body)
                }else{
                     res.send( await Groups_scheme.find().lean())
                     console.log("groups returned super ", await Groups_scheme.find().lean(), req.body)
                }
               
                
            
            
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
http.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running ${process.env.PORT || 3000}`)
})
