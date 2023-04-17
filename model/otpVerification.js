const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const otpVerificationModel = Schema({

    userId: {
        type: String,
        required: true
    },
    otp: String,
    createdAt: Date,
    expiresAt: Date,

})
const otpVerification = mongoose.model("otpVerification", otpVerificationModel);
module.exports = otpVerification;