const mongoose = require('mongoose');

var User = mongoose.model('User',  {
email : {
    required : true,
    type : String,
    minlength : 1,
    trim : true
},
password : {
    type : String,
    default : 123
}
});
module.exports = {User};