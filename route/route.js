const express = require ('express');
const { adminRegister, adminSignIn, updateAdmin, getUsers, deleteUser, superAdminRegister, superAdminSignin, listUsers, listAdmins, listSuperAdmins, adminSignin, uploadCourse, uploadCourseEdited, deleteCourse, deleteVideo } = require('../controller/adminController');
const { listCourses, addCourse, searchCourse } = require('../controller/courseController');
const { payment } = require('../controller/paymentController');
const { register, signIn, updateUser, resetPassword, forgotPassword, otp, verifyOtp, resetPasswordBeforeLogin, resendOtp, sendOtp, addToCart, deleteCart, registerPaidCouse } = require('../controller/userController');
const { adminRole, superAdminRole } = require('../middleware/role');
const { jwtVerify } = require('../middleware/jwt');

const router = express.Router()

// //user route
router.post('/register', register)
router.post('/signin', signIn)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp', verifyOtp)
router.post('/send-otp', sendOtp)
router.post('/paid-course', registerPaidCouse)
router.post('/resend-otp', resendOtp)
router.post('/reset-password', resetPassword)
router.post('/reset-password-beforelogin', resetPasswordBeforeLogin)
router.post('/update-user',jwtVerify, updateUser)

// admin route
router.post('/register-admin',jwtVerify ,superAdminRole ,adminRegister)
router.post('/register-super-admin',jwtVerify ,superAdminRole ,superAdminRegister)
router.post('/signin-admin', adminSignin)
router.post('/signin-super-admin', superAdminSignin)
router.post('/update-admin',jwtVerify ,adminRole, updateAdmin)
router.post('/list-users',jwtVerify ,adminRole ,listUsers)
router.get('/list-admins',jwtVerify ,listAdmins)
router.post('/list-super-admins',jwtVerify ,superAdminRole ,listSuperAdmins)
// router.post('/delete-user', jwtVerify ,adminRole, deleteUser)
router.post('/upload-course', jwtVerify,uploadCourse)
router.post('/upload-course-edited', jwtVerify, uploadCourseEdited)
router.get('/admin-get-courses', jwtVerify, listCourses)
router.get('/get-users',jwtVerify,  getUsers)
router.post('/add-course', addCourse)

router.delete('/delete-course/:courseId', jwtVerify, deleteCourse)
router.delete('/delete-course/:videoId', jwtVerify, deleteVideo)
router.delete('/delete-user/:userId', jwtVerify, deleteUser)


// course route 
// router.post('/add-course',jwtVerify ,adminRole, addCourse)
router.get('/get-courses', listCourses)
router.delete('/remove-from-cart/:courseId/:userEmail', deleteCart)   
router.get("/search", searchCourse)
router.post("/add-to-cart", addToCart) 
router.post("/toggle-status",jwtVerify ,adminRole)

// paystack route
// router.post('/payment', payment)
module.exports = router;