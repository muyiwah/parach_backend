const bcrypt = require('bcrypt')
const userModel = require('../model/userModel')
const jwt = require('jsonwebtoken')
const createError = require('../custom-error/error')

//register user
module.exports.register = async (req, res, next) => {
  try {
    const { email, password, fullName, phone } = req.body
    if (!(email, password, fullName, phone)) {
      next(createError(400, 'All fields required'))
    } else {
      const checkUser = await userModel.findOne({ email: email })
      if (checkUser) {
        next(createError(400, 'User already exists'))
      } else {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const user = new userModel({ ...req.body, password: hash })
        await user.save()
        res.status(201).json({ message: 'user registered successfully' })
      }
    }
  } catch (error) {
    next(error)
  }
}

// sign-in user
module.exports.signIn = async (req, res, next) => {
  const { email } = req.body
  try {
    const user = await userModel.findOne({ email: email })
    if (!user) {
      next(createError({ status: 404, message: 'user not found' }))
    } else {
      const checkPassword = await bcrypt.compare(
        req.body.password,
        user.password,
      )
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.TOKEN_SECRET,
        {
          expiresIn: '12h',
        },
      )
      const { password, ...other } = user._doc
      if (checkPassword) {
        res
          .status(200)
          .cookie('access_token', token, { httpOnly: true, secure: true })
          .json(other)
      }
    }
  } catch (error) {
    next(error)
  }
}
//update user
module.exports.updateUser = async (req, res, next) => {
  const { email } = req.body
  try {
    const user = await userModel.findOne({ email: email })
    if (!user) {
      next(createError(404, 'user not found'))
    } else {
      await userModel.findOneAndUpdate(
        { email: email },
        { $set: { ...req.body } },
        { new: true },
      )
      res.status(201).json({ message: 'user data updated successfully' })
    }
  } catch (error) {
    next(error)
  }
}

//delete user
module.exports.deleteUser = async (req, res, next) => {
  const { email } = req.body
  try {
    const user = await userModel.findOne({ email: email })
    if (!user) {
      next(createError(404, 'user not found'))
    } else {
      await userModel.findOneAndDelete({ email: email })
      res.status(200).json({ message: 'user deleted successfully' })
    }
  } catch (error) {
    next(error)
  }
}
