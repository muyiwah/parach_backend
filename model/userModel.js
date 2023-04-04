const mongoose = require('mongoose')

const userModel = new mongoose.Schema
(
    {
        fullName: {
            type: String
        },
        email:{
            type: String,
            unique: true,
            required: true
        },
        phone:{
            type: String,
        },
        password:{
            type: String,
            required: true
        },
        created_at:{
            type: String,
            default: new Date
        }
    },
)
const user = mongoose.model('user', userModel)
module.exports = user;