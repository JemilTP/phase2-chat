const mongoose = require('mongoose')
const groupSchema = new mongoose.Schema({
    name: String,
    members: [],
    rooms: []
})

module.exports =  mongoose.model("group", groupSchema)