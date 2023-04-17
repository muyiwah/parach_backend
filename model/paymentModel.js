const mongoose = require('mongoose')

const paymentModel = new mongoose.Schema
(
    {
        paymentDetails: {
            type: [],
        }
    }
)
const payment = mongoose.model('payment', paymentModel)
module.exports = payment;