const userModel = require('../model/userModel')
const bcrypt = require('bcrypt')
const createError = require('../custom-error/error')
const jwt = require('jsonwebtoken')

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
//login admin
module.exports.adminSignIn = async (req, res, next) => {
  const { email } = req.body;
  try {
    const admin = await userModel.findOne({ email: email })
    if (!admin) {
      next(createError(404, 'admin not found'))
    } else {
      const checkPassword = await bcrypt.compare(req.body.password, admin.password)
      const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.TOKEN_SECRET, {
        expiresIn: '15m',
      })
      //exclude password
      const { password, ...other } = admin._doc
      if (checkPassword) {
        res
          .status(200)
          .cookie('token', token, { httpOnly: true, secure: true })
          .json(other)
      }
    }
  } catch (error) {
    next(error)
  }
}
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
    const users = await userModel.find()
    if (!user) {
        next(createError(404, 'user not found'))
    } else {
      const { password, ...other } = users;
      res.status(200).json(users)
    }
  } catch (error) {
    next(error)
  }
}
//delete admin
module.exports.deleteUser = async (req, res, next) => {
    try {
        const user = await userModel.findOne({ email: email })
        if(!user){
            next(createError(404, 'user not found'))
        }else{
            await userModel.findOneAndDelete({ email:email})
            res.status(200).json({ message:'user deleted successfully'})
        }
    } catch (error) {
        next(error)
    }
}