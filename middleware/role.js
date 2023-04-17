module.exports.adminRole = async (req, res, next) => {
    try {
      const token = req.header("Authorization").split(' ')[1];

      if(token){
         const {role} = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
         if (role == 'admin'){
            next()
         }
         else{
            res.status(401).send('Unauthorized')
         }
      }
      else{
          res.json({
              message: 'No token provided'
          })
      }
    } catch (error) {

      next(err)
    }
};
  
module.exports.superAdminRole = async (req, res, next) => {
    try {
      const token = req.header("Authorization").split(' ')[1];

      if(token){
         const {role} = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
         if (role == 'superAdmin'){
            next()
         }
         else{
            res.status(401).send('Unauthorized')
         }
      }
      else{
          res.json({
              message: 'No token provided'
          })
      }
    } catch (error) {

      next(err)
    }
  };