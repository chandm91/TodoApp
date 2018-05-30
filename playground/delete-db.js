const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/test', (err,client)=> {
if(err)
{
    return console.log("Unable to Connect to the DB");
}
var db = client.db();
console.log('Connected to Mongo DB');

db.collection('ToDos').deleteMany({text : 'Buy Veggies'}).then((res)=> {
    console.log(res.result.n);
});
db.collection('ToDos').deleteOne({text : 'Buy Veggies'}).then((res)=> {
    console.log(res.result.n);
});
db.collection('ToDos').findOneAndDelete({text : 'Buy Veggies'}).then((res)=> {
    console.log(res.value);
})
client.close();
});