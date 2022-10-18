const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    Groups: []
})


module.exports = mongoose.model("Users", userSchema)

