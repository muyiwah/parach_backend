const userModel = require('../model/userModel')
const bcrypt = require('bcrypt')
const createError = require('../custom-error/error')
const jwt = require('jsonwebtoken')
const { Course } = require('../model/courseModel')

module.exports.adminRegister = async (req, res, next) => {
  const { fullName, email, password, phone, location } = req.body
  try {
    if (!(fullName && email && password && phone && location)) {
      next(createError(400, 'fields input required '))
    } else {
      const checkIfAdminExists = await userModel.findOne({ email: email })
      if (checkIfAdminExists) {
        next(createError(404, 'admin already exists'))
      } else {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const admin = new userModel({
          ...req.body,
          role: 'admin',
          password: hash,
        })
        await admin.save()
        res.status(201).json({ message: 'admin registration successfully' })
      }
    }
  } catch (error) {
    next(error)
  }
}

module.exports.superAdminRegister = async (req, res, next) => {
  const { fullName, email, password, phone, location } = req.body
  try {
    if (!(fullName && email && password && phone && location)) {
      next(createError(400, 'fields input required '))
    } else {
      const checkIfAdminExists = await userModel.findOne({ email: email })
      if (checkIfAdminExists) {
        next(createError(404, 'admin already exists'))
      } else {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const admin = new userModel({
          ...req.body,
          role: 'superAdmin',
          password: hash,
        })
        await admin.save()
        res.status(201).json({ message: 'admin registration successfully' })
      }
    }
  } catch (error) {
    next(error)
  }
}
//login admin



module.exports.superAdminSignin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
   
      const user = await userModel.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "user with email not found" });
    console.log(user.role);
      if(user.role!=="superAdmin")return res.status(400).json({message:"You are not an admin"})
      console.log('here1'); const correctPassword = await bcrypt.compare(password, user.password);
        const token = await jwt.sign(
          {
            id: user.id,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "12h" },
        );
        if (correctPassword) {
          if (user.status == "disabled") {
            res
              .status(404)
              .json({ message: "user has been disabled, contact admin" });
          } else {console.log('here');
            const { password, ...other } = user._doc;console.log(other);
            res.status(200).json({
              message: "success",
              data: {
                 token,
               other,
              },
              status: "200",
            });
          }
        } else {
          res.status(404).json({ message: "invalid email or password" });
        }
  
    
  } catch (error) {
    next(error);
  }
};




module.exports.adminSignin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("All input is required");
    } else {
      const user = await userModel.findOne({ email: email });
      if (user && user.role === "admin") {
        const correctPassword = await bcrypt.compare(password, user.password);
        const token = await jwt.sign(
          {
            id: user.id,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "12h" },
        );
        if (correctPassword) {
          if (user.status == "disabled") {
            res
              .status(404)
              .json({ message: "user has been disabled, contact admin" });
          } else {
            const { password, ...other } = user._doc;
            res.status(200).json({
              message: "success",
              data: {
                token: token,
                data: other,
              },
              status: "200",
            });
          }
        } else {
          res.status(404).json({ message: "invalid email or password" });
        }
      } else {
        res.status(404).json({ message: "user not found" });
      }
    }
  } catch (error) {
    next(error);
  }
};
//update admin
module.exports.updateAdmin = async(req, res, next)=> {
    const { email } = req.body
    try {
        const admin = await userModel.findOne({ email: email})
        if(!admin){
            next(createError(404, 'record not found'))
        }else{
          if(admin.role === req.user.role){
            await userModel.findOneAndUpdate({email:email},{$set: {...req.body}},
            {new : true})
            res.status(200).json({message: 'admin data updated successfully'})
          }else{
            next(createError(401, 'unauthorized'));
          }
        }
    } catch (error) {
        next(error)
    }
}
//get user
module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await userModel.find().where("role").equals("user")
    if (!users) {
        next(createError(404, 'user not found'))
    } else {
      const { password, ...other } = users;
     console.log(other); res.status(200).json(users)
    }
  } catch (error) {
    next(error)
  }
}
//delete admin
// module.exports.deleteUser = async (req, res, next) => {
//     try {
//         const user = await userModel.findOne({ email: email })
//         if(!user){
//             next(createError(404, 'user not found'))
//         }else{
//             await userModel.findOneAndDelete({ email:email})
//             res.status(200).json({ message:'user deleted successfully'})
//         }
//     } catch (error) {
//         next(error)
//     }
// }

module.exports.listUsers = async (req, res, next) => {
  try {
    const users = await userModel.find().where("role").equals("user");
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

module.exports.listAdmins = async (req, res, next) => {
  try {
    const users = await userModel.find().where("role").equals("superAdmin");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports.listSuperAdmins = async (req, res, next) => {
  try {
    const users = await userModel.find().where("role").equals("superAdmin");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}; 

module.exports.uploadCourseEdited = async (req, res, next) => {
  const {id, duration, title,description,price,image,overview ,isPaid,videos} = req.body;
  var newVideo = [];
  await Course.findByIdAndDelete(id);
console.log(videos.length);
  for (let i = 0;  videos.length > i; i++) {
    // const newUrl = videos.replace(/\\-/g, '-');
 newVideo.push(videos[i]); if (videos.length==i)break
  } console.log(newVideo); 
  try {
  var course=Course({duration,description,title,description,price,image,overview,isPaid,videos:newVideo})
    console.log(course);
       course = await course.save();
      res.status(200).json(course); 
     
   
  } catch (error) { 
    next(error)
  }
}
module.exports.uploadCourse = async (req, res, next) => {
  const { duration, title,description,price,image,overview ,isPaid,videos} = req.body;
  var newVideo = [];
  for (let i = 0;  videos.length > i; i++) {
    // const newUrl = videos.replace(/\\-/g, '-');
 newVideo.push(JSON.parse( videos[i])); if (videos.length==i)break
  } console.log(newVideo); 
  try {
  var course=Course({duration,description,title,description,price,image,overview,isPaid,videos:newVideo})
    console.log(course);
       course = await course.save();
      res.status(200).json(course);
     
   
  } catch (error) { 
    next(error)
  }
}

module.exports.deleteCourse = async (req, res, next) => {
  try {
   console.log(req.params);
    const {  courseId } = req.params;
    console.log(courseId);
    
    const course = await Course.findByIdAndDelete(courseId);
    const course2 = await Course.find();
   
    
    res.status(200).json( course2);
  } catch (error) {
    next(error)
  }
}

module.exports.deleteUser = async (req, res, next) => {
  try {
  //  console.log(req.params)/;
    const {  userId } = req.params;
    console.log('userId');
    console.log(userId);
    
    const user = await userModel.findByIdAndDelete(userId);
    const user2 = await userModel.find();
   
    
    res.status(200).json( user2);
  } catch (error) {
    next(error)
  }
}