const mongoose = require('mongoose');

var Todo = mongoose.model('Todo',  {
text : {
    required : true,
    type : String,
    minlength : 1,
    trim : true
},
completed : {
    type : Boolean,
    default : false
},
completedAt : {
    type : Number
}
});
module.exports = {Todo};