const express = require('express');
const bodyParser =require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const bcrpyt = require('bcryptjs');

const {env} = require('./config/config');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
var {authenticate} = require('./autheticate/authenticate');
var port = process.env.PORT;
var app = express();
app.use(bodyParser.json());

app.post('/todos',authenticate,(req,res)=> {
    var todo = new Todo({text : req.body.text});
    todo.save().then((result)=> {
        console.log(JSON.stringify(result,undefined,2));
        res.send(result);
    },(e)=> {
        console.log(e);
        res.status(400).send(result);
    });
});

app.get('/todos',authenticate,(req,res)=> {
    Todo.find({}).then((todos)=> {
        console.log(JSON.stringify(todos,undefined,2));
        res.send({todos});
    },(e)=> {
        console.log(e);
        res.status(400).send(e);
    });
});

app.get('/todos/:id', authenticate,(req,res)=> {
    var id = req.params.id;
    console.log(id);
    if(!ObjectID.isValid(id))
        return res.status(400).send();
    
    Todo.findById(id).then((todo)=> {
        console.log("The object is ");
        console.log(JSON.stringify(todo,undefined,2));
        res.send(todo);
    },(e)=> {
        //console.log(JSON.stringify(todo,undefined,2));
        res.status(400).send();
    });
});

app.delete('/todos/:id',authenticate, (req,res)=> {
    var id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(400).send();
    
    Todo.deleteOne({_id : id}).then((todo)=> {
        console.log("The object is ");
        console.log(JSON.stringify(todo,undefined,2));
        res.send(todo);
    },(e)=> {
        //console.log(JSON.stringify(todo,undefined,2));
        res.status(400).send();
    });
});

app.patch('/todos/:id',authenticate,(req,res)=> {
    var id = req.params.id;
    var body = _.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id))
        return res.status(400).send();
    if(_.isBoolean(body.completed) && body.completed)
    {
        body.completedAt = new Date().getTime();      
    }
    else {
        body.completedAt = null;
        body.completed=false;
    }
    console.log(JSON.stringify(body,undefined,2));
    Todo.findByIdAndUpdate(id,{$set : body},{new : true}).then((todo)=> {
        console.log(todo);
        res.send(todo);
    },(e)=> {
        res.status(404).send();
    });
});
app.post('/users' ,(req,res)=> {
    var body = _.pick(req.body,['email','password']);
    var user = new User(body);
    user.generateAuthToken().then((token)=> {
        res.header('x-auth',token).send(_.pick(user,['email','_id']));
    },(e)=> {
        res.status(404).send(e);
    });

});

app.post('/users/login', (req,res)=> {
    var reqbody = _.pick(req.body,['email','password']);
   User.findByCredential(reqbody.email,reqbody.password).then((user)=> {
        console.log(user);
        console.log(reqbody.password);
        console.log(user.password);
        user.generateAuthToken().then((token)=> {
            res.header('x-auth',token).send(_.pick(user,['email','_id']));
        
        });
        
    }).catch((e)=> {
        res.status(404).send(e);
    });
   
})

app.delete('/users/logout',authenticate,(req,res)=> {
        console.log(typeof req.user);
       var user = new User(req.user);
        
        console.log(req.token);
        console.log(req.id);
      /*  User.findOne({_id : req.id}).then((user)=> {
            console.log(user);*/
            req.user.update({
                $pull : {
                    tokens : {token : req.token}
                }
            }).then((user)=> {
                res.send(user);
            }).catch((e)=> {
            res.status(404).send(e);
        });
     
   })


app.listen(port,()=> {
    console.log(`Server listening on ${port} port`);
});


module.exports = { app};
