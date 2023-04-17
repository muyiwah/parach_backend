const mongoose = require('mongoose')
const paidCoursesModel = new mongoose.Schema({
    subCategory: {
        type:[String],
        default: []
    },
    created_at:{
        type: String,
        default: new Date
    }
})

const paidCourse = mongoose.model('paidCourse', paidCoursesModel)
module.exports = paidCourse; 