const mongoose = require('mongoose');
const { courseSchema } = require('./courseModel');

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
        isVerified: {
            type: Boolean, 
        default:false},
        status: {
            type: String,
            default: 'enabled',
            enum: ['enabled', 'disabled' ]
        },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin', 'superAdmin' ]
        },
        enabled: {
            type: Boolean,
        default:true},
        cart: [], 
        paidCourses:[],
        created_at:{ 
            type: String,
            default: new Date
        },
    }, 
)
const user = mongoose.model('user', userModel)
module.exports = user;  