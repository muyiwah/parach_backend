const bcrypt = require('bcrypt')
const userModel = require('../model/userModel')
const jwt = require('jsonwebtoken')
const createError = require('../custom-error/error')
const { sendEmail } = require('../emailService/email')
const otpVerification = require('../model/otpVerification')
const user = require('../model/userModel')
const { Course } = require('../model/courseModel')
const e = require('express')

//register user
module.exports.register = async (req, res, next) => {
  try { 
    console.log(req.bod);
    const { email, password, fullName, phone, address,cart } = req.body
    console.log(req.body);
    if (!(email, password, fullName, phone)) 
     return res.status(400).json({message: 'all fields are required'})
  
     
      const checkUser = await userModel.findOne({ email: email })
      if (checkUser) { 
        res.status(400).json({message: "user already exists, please proceed to login"})
      } else {
        const salt = await bcrypt.genSalt(10) 
        const hash = await bcrypt.hash(password, salt)
        const user = new userModel({ email, password, fullName, phone, address,cart , password: hash })
        const otp=(Math.floor( Math.random() * 10000) + 10000).toString().substring(1);
      const savedUser=  await user.save()
      const subject = "verification";
        const text = `you can verify your account with the otp ${otp}`;
        sendEmail(email, otp, savedUser._id, subject, text);
       
        
         res.status(200).json({ message: 'an OTP has been sent to your email, please use it to verify your account',user:savedUser })
      }
     
  } catch (error) { 
    next(error) 
  }
}

// sign-in user
module.exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
  console.log(email);console.log(password);
    const user = await userModel.findOne({ email: email });
    if(!user)return res.status(400).json({message:"user with email not found"})
    const correctPassword = await bcrypt.compare(password, user.password);
      if (user) {
        const otp=(Math.floor( Math.random() * 10000) + 10000).toString().substring(1);
            const { ...other2 } = user._doc;
            const subject = "verification";
        const text = `you can verify your account with the otp ${otp}`; 
        if (user.isVerified == false && correctPassword) {sendEmail(email,otp,user._id,subject,text)
          res.status(419).json({ message: "your account is not verified, an OTP has been sent to your email, please verify",data: {
           other2, 
         },})
        } else {
          

          const correctPassword = await bcrypt.compare(password, user.password);
          if(!correctPassword) return  res.status(404).json({ message: "invalid password" });
          const token = await jwt.sign(
            {
              id: user.id,
              email: user.email,
              phoneNumber: user.phoneNumber,
              role: user.role, 
            },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }, 
          );
          if (correctPassword) {
            const { password, ...other } = user._doc;
            res.status(200).json({
              message: "success",
              data: {
                 token,
                other, 
              },
              status: "200",
            });
          } 
        }
      } else {
        res.status(404).json({ message: "user not found, check and be sure you entered the correct email" });
      }
    
  } catch (error) {
    next(error);
  }
};
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
//add to cart
module.exports.addToCart = async (req, res, next) => {
  const { courseId, email } = req.body;
  var isFound = false;
  console.log(courseId);console.log(email);
  try {
    const user = await userModel.findOne({ email: email })
    const course = await Course.findById({ _id: courseId });
    console.log(courseId);
    // console.log(user.cart[2]._id);
    if (user.cart.length>0) {
      for (let i = 0; user.cart.length; i++) {
        if (user.cart[i]._id.equals(courseId)) {
          isFound = true; console.log('ooooooooooooooooo'); console.log(isFound);
         return res.status(400).json({ message: "you have already added this course to cart" })
           }
      //  console.log('hyyyyyyyyyyyyyyyyy');
        
        break;
      } 
      
      if(isFound==false) {
        console.log('hyyyyyyyyyyyyyyyyy');  console.log(isFound);  
            user.cart.push( course );
          const user2 = await user.save();
           // console.log(userf2);  
           res.status(200).json({
             message: "success",
             data: { user2},
             status: "200",
           });
          }   } 
    else if (user.cart.length == 0) {
      user.cart.push( course );
        const user2 = await user.save();
         // console.log(userf2); 
         res.status(200).json({ 
           message: "success",
           data: { user2},
           status: "200",
         });
      }
    // user.cart.push( course );
    //     const user2 = await user.save();
    //      // console.log(userf2);  
    //      res.status(200).json({
    //       message: "success",
    //       data: {
          
    //         user2, 
    //       }, 
    //       status: "200",
    //     });
   
  } catch (error) { 
    next(error)
  }
}


/////////for (let i = 0; i < user.cart.length; i++) {
    //   if (user.cart[i]._id.equals(courseId)) {
    //     user.cart.splice(i, 1);
    //   break;
    // } 
//resgister paid courses
module.exports.registerPaidCouse = async (req, res, next) => {
  const { courseId, email,pay } = req.body;
  var isFound = false;
  console.log(courseId);console.log(pay);
  try {
    const user = await userModel.findOne({ email: email })
    
      for (let i = 0; pay.length; i++) {

        const myCourse = await Course.findById({ _id: pay[i] });
        user.paidCourses.push(myCourse);
        myCourse.enrolled = myCourse.enrolled + 1;
        await myCourse.save();
      if (i == pay.length - 1) break;
    } user.cart = [];
      const user2 = await user.save();
      res.status(200).json({
        message: "success",
        data: { user2},
        status: "200",
      });
    // const course = await Course.findById({ _id: courseId });
    // console.log(courseId);
    // // console.log(user.cart[2]._id);
    // if (user.paidCourses.length>0) {
    //   for (let i = 0; user.cart.length; i++) {
    //     if (user.paidCourses[i]._id.equals(courseId)) {
    //       isFound = true; console.log('ooooooooooooooooo'); console.log(isFound);
    //      return res.status(400).json({ message: "you previously paid for this course"})
    //        }
    //   //  console.log('hyyyyyyyyyyyyyyyyy');
        
    //     break;
    //   } 
      
    //   if(isFound==false) {
    //         user.paidCourses.push( course );
    //       const user2 = await user.save();
    //        // console.log(userf2);  
    //        res.status(200).json({
    //          message: "success",
    //          data: { user2},
    //          status: "200",
    //        });
    //       }   } 
    // else if (user.paidCourses.length == 0) {
    //   user.paidCourses.push( course );
    //     const user2 = await user.save();
    //      // console.log(userf2); 
    //      res.status(200).json({ 
    //        message: "success",
    //        data: { user2},
    //        status: "200",
    //      });
    //   }
    // // user.cart.push( course );
    // //     const user2 = await user.save();
    // //      // console.log(userf2);  
    // //      res.status(200).json({
    // //       message: "success",
    // //       data: {
          
    // //         user2, 
    // //       }, 
    // //       status: "200",
    // //     });
   
  } catch (error) { 
    next(error)
  }
}
//delete cart
module.exports.deleteCart = async (req, res, next) => {
  try {
   console.log(req.params);
    const { userEmail, courseId } = req.params;
    // console.log(courseId);
    // console.log(userEmail);
    // console.log(userId);
    const course = await Course.findById(courseId);
    let user = await userModel.findOne({email:userEmail});

    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i]._id.equals(courseId)) {
          user.cart.splice(i, 1);
        break;
      } 
    }
    console.log(user);
    console.log(user.cart.length);
    user = await user.save();
    res.status(200).json({ 
      message: "success",
      data: { user},
      status: "200",
    });
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

module.exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user =await userModel.findOne({ email });
  if(!user) return  res.status(400).json({ message: 'no user account found, please signup to continue' })
  const otp=(Math.floor( Math.random() * 10000) + 10000).toString().substring(1);
  const subject = "Password Reset";
  const text = `you can reset your account with the otp ${otp}`;
  sendEmail(email,otp,user._id,subject,text)
    res.status(401).json({ message: "An OTP has been sent to your email, please verify"})
  }




module.exports.verifyOtp = async (req, res, next) => {
  try {
    const {otp, id } = req.body;
console.log(otp);
console.log(id);
    const otpVerificationRecords = await otpVerification.findOne({ userId: id });
    console.log(otpVerificationRecords);
      if(!otpVerificationRecords) return res.status(400).json({message:"Account record doesn't eist or account is already verified. Please signup or login"})
    // if(otpVerificationRecords.length <=0){return res.status(400).json({message:"Account record doesn't eist or account is already verified. Please signup or login"})}
      const { expiresAt } = otpVerificationRecords;
      if (expiresAt < Date.now()) {
        await otpVerification.deleteOne({ userId:id })
      return  res.status(400).send("OTP has expired. Please request again");
      }
      const hashedOTP = otpVerificationRecords.otp;
    // const otpValid =await bcrypt.compare(otp, hashedOTP);
      if ( otpVerificationRecords.otp!==otp) return res.status(400).send("invalid OTP, request for a new OTP");
      await user.updateOne({ _id: id }, { isVerified: true });
      await otpVerification.deleteMany({ userId: id });
      return  res.status(200).send(true); 

     
    


   } catch (e) {
    
    res.status(500).json({ error: e.message })
  }
}


module.exports.resendOtp = async (req,res,next)=>{
  try {
    const { email,id } = req.body;

    const otpVerificationRecords = await otpVerification.findOne({ userId: id });
    console.log(otpVerificationRecords);
   
    if(otpVerificationRecords) { await otpVerification.deleteMany({ userId: id });}
    const otp=(Math.floor( Math.random() * 10000) + 10000).toString().substring(1);
     const subject = "verification";
      const text = `you can verify your account with the otp ${otp}`;
    sendEmail(email, otp, id, subject, text);
    console.log('resent');
    // return res.status(200).send(true);

    
    


   } catch (e) {
    
    res.status(500).json({error: e.message})  }

}

module.exports.sendOtp = async (req,res,next)=>{
  try {
    const { email } = req.body;

   
    const user = await userModel.findOne({ email });
    if(!user)return res.status(400).send({message:'email not found, sign-up to continue'})
    const id = user.id;
    console.log(user);
    const otpVerificationRecords = await otpVerification.findOne({ userId: id });
    console.log(otpVerificationRecords);
   
    if (otpVerificationRecords) { await otpVerification.deleteMany({ userId: id }); }
    const otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    const subject = "Reset Password";
      const text = `you can reset your password with the otp ${otp}`;
    sendEmail(email, otp, id, subject, text);
    return res.status(200).send({user:user} );

       } catch (e) {
    
    res.status(500).json({error: e.message})  }

}
module.exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    if (!password) {
      res.status(400).send("All input is required");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      if (token) {
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
        if (verifyToken) {
          const { email } = JSON.parse(
            Buffer.from(verifyToken.split(".")[1], "base64").toString(),
          );
          await userModel.findOneAndUpdate({
            email: email,
            password: hashPassword,
            // new: true,
          });
        }
      } else {
        res.status(404).json({ message: "user not found" });
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports.resetPasswordBeforeLogin = async (req, res, next) => {
  const { email,password } = req.body;
  try {
 
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
    const user = await userModel.findOne({ email });
    if(!user) return   res.status(404).json({ message: "user not found, ensure you enterd the correct email" });
         
          await userModel.updateOne({email: email }, { password: hashPassword });
    res.status(200).json(true)
       
    
  }
  catch (error) {
    next(error);
  }
};
// try { 
//   if (!email) {
//     res.status(400).send("All input is required");
//   } else {
//     const user = await userModel.updateOne({ email: email }, { $set: { isVerified: true } }, { new: true }, (error, result) => {
//       if (error) {
        
//         res.status(404).json({ message: "Invalid OTP" });
//       } else {
//         res.status(200);
//       }    
//     });
  
//   }
// } catch (error) {
//   next(error);
// }