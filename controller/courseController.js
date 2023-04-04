const { v4: uuidv4 } = require('uuid')
const { createError } = require('../custom-error/error')
const courseModel = require('../model/courseModel')

module.exports.addCourse = async (req, res, next) => {
  const { title, description, price, image, overview } = req.body
  try {
    if (!(title && description && price && image && overview)) {
      next(createError(400, 'field required'))
    } else {
      const checkCourse = await courseModel.findById({ id: courseId })
      if (checkCourse) {
        next(createError(400, 'course already exists'))
      } else {
        const course = new courseModel({
          ...req.body,
          userId: req.body.id,
          courseId: uuidv4(),
        })
        course.save()
        res.status(201).json({ message: 'Course created successfully' })
      }
    }
  } catch (error) {
    next(error)
  }
}

// list courses
module.exports.listCourses = async (req, res, next) => {
  try {
    const course = await courseModel.find({ skip: 10, limit: 5 }, (err, results) =>
    {
      if(err){
        res.status(404).json({ message: 'courses not found' })
      }else{
        res.status(200).json({ message: results})
      }
     })
    res.status(200).json(course)
  } catch (error) {
    next(error)
  }
}
// //paid courses
// module.exports.paidCourses = async( req, res, next) => {
//     const { }
// }
//search course by titles
module.exports.searchCourse = async (req, res, next) => {
  const query = req.query.q
  try {
    const title = query.split(',')
    //i is case insensitive
    // regular expression for pattern matching string in queries
    //search job by titles
    const search = await courseModel.find({
      title: { $regex: title, $options: 'i' },
    })

    res.status(200).json(search)
  } catch (error) {
    next(error)
  }
}
