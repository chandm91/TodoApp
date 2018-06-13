var {User} = require('./../models/user');

var authenticate = function(req,res,next) {
    
   var token = req.header('x-auth');
   console.log(`Token is ${token}`);
    User.findByToken(token).then((user)=> {
        if(!user)
           return Promise.reject();
        console.log(`Id is ${user._id}. Email is ${user.email}`);
         req.id=user._id;
         req.user = user;
         req.email = user.email;
         req.token = token;
         next();

    },(e)=> {
        res.status(400).send();
    })

   
}

module.exports = {authenticate};