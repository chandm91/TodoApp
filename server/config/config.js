var env = process.env.NODE_ENV || 'development';

if(env==='development')
{
    process.env.PORT = 3000;
    process.env.mongodbURL = "mongodb://localhost:27017/Todos";
}
else if(env==='test')
{
    process.env.PORT = 3000;
    process.env.mongodbURL = "mongodb://localhost:27017/TodosTest";
}

module.exports={env};