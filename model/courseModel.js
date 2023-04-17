const mongoose = require('mongoose')

const courseSchema  =  new mongoose.Schema
(
    {
       
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
            type: String,
        },
        videos:  [{}],   
        isPaid: {
            type: Boolean,
            default: false
                    },
        enrolled: {
            type: Number,
            default: 0
        },
        // rate: { type: [] },
        duration: { type: Number,
        default:0 },
        
         created_at : {
            type: String,
            default: new Date
        },
       
    }
)
  
const Course = mongoose.model('Course', courseSchema)
module.exports = {Course,courseSchema};