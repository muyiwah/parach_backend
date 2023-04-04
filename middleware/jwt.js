const jwt = require('jsonwebtoken')

module.exports.userId = async (req, res, next) => {
    try {
        const token = req.header('Authorization').split(' ')[1]
        if(!token){
            next(createError(401, 'unauthorized'))
        }else{
            jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
                if(err){
                    next(createError(403, 'invalid token'))
                }else{
                    req.user = payload;
                    next()
                }
            })
        }
    } catch (error) {
        next(error)
    }
}