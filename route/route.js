const express = require('express');
const { adminRegister, adminSignIn, updateAdmin, getUsers, deleteUser } = require('../controller/adminController');
const { listCourses, addCourse, searchCourse } = require('../controller/courseController');
const { payment } = require('../controller/paymentController');
const { register, signIn, updateUser } = require('../controller/userController');

const router = express.Router()

//user route
router.post('/register', register)
router.post('/sign-in', signIn)
router.post('/update-user', updateUser)

//admin route
router.post('/register-admin', adminRegister)
router.post('/signin-admin', adminSignIn)
router.post('/update-admin', updateAdmin)
router.post('/list-users', getUsers)
router.post('/delete-user', deleteUser)


// course route 
router.post('/add-course', addCourse)
router.get('/list-course', listCourses)
router.get("/search", searchCourse)

// paystack route
router.post('/payment', payment)
module.exports = router;