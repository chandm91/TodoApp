const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/test', (err,client)=> {
if(err)
{
    return console.log("Unable to Connect to the DB");
}
var db = client.db();
console.log('Connected to Mongo DB');
db.collection('Users').insertMany([{
    name : 'Chandni',
    age : 26
},{
    name : 'Arjun',
    age : 29
},{
    name : 'Karthika',
    age : 49
}]).then((res)=> {
    console.log(`Inserted  ${res.result.n} documents.The document inserted is `);
    console.log(JSON.stringify(res.ops,undefined,2));
});
client.close();
});