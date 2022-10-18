const mongoose = require('mongoose')
const groupSchema = new mongoose.Schema({
    name: String,
    members: [],
    chat: {messages:[]},
    
})

module.exports =  mongoose.model("group", groupSchema)