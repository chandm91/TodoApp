const expect = require('expect');
const request = require('supertest');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');
var {User} = require('./../models/user');
var text =  'Book tickets for the Movie';
describe('REST API POST',()=> {

    it('POST /todos', (done)=> {
        
        Todo.deleteMany({text}).then((res)=> {
            request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect(((res)=> {
               // console.log(typeof res.body.text);
                expect(res.body.text).toBe('Book tickets for the Movie');      
            }))
            .end((err,res)=> {  
                if(err)
                    return done(err);
                else 
                        Todo.find({text : text}).then((todos)=> {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    }).catch((e)=> done(e));
            });
        });   
    });

});

describe('GET TEST',()=> {

    it('GET /todos', (done)=> {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=> {
            expect(res.body.todos.length).toBe(1);      
        })
        .end(done);
    });

   it('GET /todos/id', (done)=> {
   // var text =  'Book tickets for the Movie'
       Todo.find({text}).then((res)=> {
        console.log(res);
        var id = res[0]._id;
        console.log("Id is "+id);
        request(app)
       .get(`/todos/${id}`)
       .expect(200)
       .expect((res)=> {
         
           expect(res.body.text).toBe(text);
       })
       .end(done);
       }, (e)=>{
           return done(e);
       });
       
    });
    
});
describe('PATCH /todos/id', ()=> {
    it('Patch test', (done)=> {
        var completed = true;
        Todo.find({text}).then((res)=> {
            var id = res[0]._id;
            request(app)
            .patch(`/todos/${id}`)
            .send({completed})
            .expect(200)
            .expect((res)=> {
                console.log(res.body);
                expect(res.body.completed).toBe(completed);
                expect(res.body.completedAt).not.toBeNull();
              
            })
            .end((err,res)=> {
                if(err)
                    return done(err);
                Todo.findOne({text}).then((todos)=> {
                  expect(todos.completed).toBe(completed);
                   done();
                },(e) => done(e));
            })

        });

    })
});

describe('DELETE /todos/id', ()=> {
    it('delete test', (done)=> {
        Todo.find({text}).then((res)=> {
            var id = res[0]._id;
            request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res)=> {
                console.log(res.body);
                expect(res.body.n).toBe(1);
                expect(res.body.ok).toBe(1);
            })
            .end((err,res)=> {
                if(err)
                    return done(err);
                Todo.find({text}).then((todos)=> {
                  expect(todos.length).toBe(0);
                   done();
                },(e) => done(e));
            })

        })

    });
});
    
