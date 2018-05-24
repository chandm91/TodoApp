const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/test', (err,client)=> {
if(err)
{
    return console.log("Unable to Connect to the DB");
}
var db = client.db();
console.log('Connected to Mongo DB');
db.collection('ToDos').find({text : 'Eat Lunch'}).toArray().then((res)=> {
    console.log(res);
});
client.close();
});