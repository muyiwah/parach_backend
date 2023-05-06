const jwt = require('jsonwebtoken')
const userModel = require('../model/userModel')

module.exports.jwtVerify = async (req, res, next) => {
    try {
    console.log('jwtjwtyjwtkwt');
    const token = req.header('token');
        if (!token) return res.status(401).json({ error: "no auth token " });
        console.log('veryfing');
        const tokenVerify = jwt.verify(token, process.env.JWT_SECRET);
        console.log('passed');
        if (!tokenVerify)return res.status(401).json({ error: "you are not authorized to go this route" });
        // req.token = tokenVerify.token; req.id = tokenVerify.id;
       console.log(tokenVerify.email ); 
       console.log(tokenVerify);
       const user = await userModel.findOne({ email: tokenVerify.email });
        // console.log(user);
        if (user.role == "user") return res.status(401).json({ error: "you are not an admin" });
        if (user.role == "superAdmin") next();
            
    } catch (e) { res.status(500).json({ error: e.meesage }) };
} 