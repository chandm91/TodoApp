const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {ObjectID} =require('mongodb');
var UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        minlength : 1,
        trim : true,
        unique : true,
        validate : 
        {
            validator : validator.isEmail,
            message : '${VALUE} not a valid mail'
        }
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    },
    tokens : [{
        access : {
            type : String ,
            required : true
        },
        token : {
            type : String,
            required : true
        }
    }]
});
UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({id : this._id, access: access},'123abc').toString();
    this.tokens.push({access,token});
    console.log(JSON.stringify(this.tokens));
   return this.save().then(()=> {
        return token;
    });
}

UserSchema.statics.findByCredential = function(email,password) {
    var User = this;
   return this.findOne({email}).then((user)=> {
        if(!user)
        {
            return Promise.reject();
        }
        else {
                
                   // console.log(password);
                  //  console.log(user.password);
                  return new Promise((resolve,reject)=> {
                     bcrypt.compare(password,user.password,(err,res)=> {
                        if(res===true)
                        {
                            //console.log(typeof res);
                             resolve(user);     
                        } 
                      else{
                          reject();
                      }
                    });
                  });
                   
                           
                              
                      
                  
        }
   
    }).catch((e)=> {
        return Promise.reject(e);
    });
}
UserSchema.statics.findByToken = function(token) {

   var User = this;
   var decoded ; 
  try {
    decoded = jwt.verify(token , '123abc');
    console.log(`Decoded ${JSON.stringify(decoded,undefined,2)}`);
    console.log('Token '+ token);
    console.log(`${typeof decoded.id}`)
  }  catch(e)
  {
      return Promise.reject();
  }
   return this.findOne({
       '_id' : decoded.id,
      'tokens.access' : decoded.access,
       'tokens.token' : token
   }).then((user) => {
       console.log(`User ${JSON.stringify(user,undefined,2)}`);
       return user;
   },(e)=> {
        return Promise.reject();
   })
}

UserSchema.pre('save', function (next){
    var user = this;
   bcrypt.genSalt(10, (err,salt) => {
       bcrypt.hash(this.password,salt,(err,hash)=> {
          this.password = hash;
          next();
       });
   })
})
var User = mongoose.model('User', UserSchema);
module.exports = {User};