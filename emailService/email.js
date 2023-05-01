const nodemailer = require("nodemailer");
const otpVerification = require("../model/otpVerification");
const bcrypt = require('bcrypt')

module.exports.sendEmail = async function (email, otp,id,subject,text) {
  try {

    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newOtpVerification = new otpVerification({
      userId: id,
      otp: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000
//221840
    });
    console.log(newOtpVerification);
await newOtpVerification.save();
    // async..await is not allowed in global scope, must use a wrapper

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//       //using elastic email as the email servic provider
//       host: "sandbox.smtp.mailtrap.io",
//       port: 587,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: "884f8f8de7d51d", // generated ethereal user
//         pass: "cee93f0375cb00", // generated ethereal password
//       },
//       tls: {
//         rejectUnauthorized: false
//     },
//     }); 

//    let info= await transporter.sendMail({
//       from: "muyiwah457@gmail.com", // sender address
//       to:  "muyiwah457@gmail.com", // list of receivers
//       subject: subject, // Subject line
//       text: text,
//     //  message: otp,
//     html:`<p> your otp is ${otp}</p>`
  
// });
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'parachcomputers@gmail.com',
    pass: 'olse nlsq oqyu mbft'
  },
  tls: {
  rejectUnauthorized: false
}
}); 

var mailOptions = {
  from: 'flutter4572@gmail.com',
  to: 'muyiwah457@gmail.com',
  subject: subject,
  text: text,
   html:`<p> your otp is ${otp}</p>`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
  } catch (error) {
  console.log(error); 
  }
  //emailService().catch(console.error);
};
 