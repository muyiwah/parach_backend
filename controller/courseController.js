const { createError } = require('../custom-error/error')
const {Course} = require('../model/courseModel')

module.exports.addCourse = async (req, res, next) => {
  const { title, description, price, image, overview,videos,enrolled,duration,isPaid} = req.body
  try {
    if (!(title && description && price && image && overview )) {
      next(createError(400, 'field required'))
    } else {
      
        const course = new Course({
         title,description,price,image,overview,videos,enrolled,duration,isPaid
        
        })
      const savedCourse = await course.save();
        res.status(200).json({message:'successfully saved course'})
      }
     
  } catch (error) {
    next(error)
  } 
} 
 
// list courses
module.exports.listCourses = async (req, res, next) => {
  try {
    const courses =await Course.find();
    res.status(200).json(courses)
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
    const search = await Course.find({
      title: { $regex: title, $options: 'i' },
    })

    res.status(200).json(search)
  } catch (error) {
    next(error)
  }
}

module.exports.toggleStatus = async (req, res, next) => {
  try {
    if (!req.body.email) {
      res.status(400).json({ message: "No valid email found" });
    } else {
      const user = await userModel.findOne({ email: req.body.email })
      if (user.status == 'enabled') {
        userModel.updateOne({ email: req.body.email }, { status: 'disabled' }, (error, result) => {
          if (error) {
            res.status(400).json({ message: 'failed to update' })
          } else {
            res.status(200).json({ message: 'user has been banned' })
          }
        });
      }
      else {
        userModel.updateOne({ email: req.body.email }, { status: 'enabled' }, (error, result) => {
          if (error) {
            res.status(400).json({ message: 'failed to update' })
          } else {
            res.status(200).json({ message: 'user ban has been lifted' })
          }
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

