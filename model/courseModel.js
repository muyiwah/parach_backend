const mongoose = require('mongoose')

const courseModel  =  new mongoose.Schema
(
    {courseId: {
        type: String,
        unique: true,
        required: true
    },
        title:{
            type: String,
        },
        description:{
            type: String,
        },
        price:{
            type: Number,
        },
        image:{
            type: String,
        },
        overview:{
            type: [String],
        },
        created_at : {
            type: String,
            default: new Date
        }
    }
)

const course = mongoose.model('course', courseModel)
module.exports = course;