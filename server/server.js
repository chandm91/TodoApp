const express = require('express');
const bodyParser =require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var port = process.env.PORT || 3000;
var app = express();
app.use(bodyParser.json());

app.post('/todos',(req,res)=> {
    var todo = new Todo({text : req.body.text});
    todo.save().then((result)=> {
        console.log(JSON.stringify(result,undefined,2));
        res.send(result);
    },(e)=> {
        console.log(e);
        res.status(400).send(result);
    });
});

app.get('/todos',(req,res)=> {
    Todo.find({}).then((todos)=> {
        console.log(JSON.stringify(todos,undefined,2));
        res.send({todos});
    },(e)=> {
        console.log(e);
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req,res)=> {
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

app.delete('/todos/:id', (req,res)=> {
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
})

app.listen(port,()=> {
    console.log(`Server listening on ${port} port`);
});


module.exports = { app};
