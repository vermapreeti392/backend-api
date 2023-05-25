const express = require('express');
const app = express();
const getConnection = require('./connection/conn');

const port = process.env.port | 5000;
getConnection();

app.use(express.json())
const eventapi = require('./routes/route');
app.use(eventapi);
app.get('/', (req,res)=>{
    res.send('hello');
})

app.listen(port, ()=>{console.log("server is up")})
