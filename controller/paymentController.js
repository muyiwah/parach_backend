require('dotenv').config()
// Require the library
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY)
const paymentModel = require('../model/paymentModel')
// const https = require('https')

module.exports.payment = async (req, res, next) => {
  const { email, amount, item } = req.body
  try {
    var reference
    paystack.transaction
      .initialize({
        PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY,
        amount: '20000', // 5,000 Naira (remember you have to pass amount in kobo)
        email: email,
        item: item,
      })
      .then((data) => {
        res.json(data)

        paystack.transaction
          .verify(data.data.reference)
          .then((result) => {
           
            const data = new paymentModel({
              paymentDetails: result.data,
            })
            data.save()
          })
          .catch((error) => {
            next(error)
          })
      })
  } catch (error) {
    next(error)
  }
}
