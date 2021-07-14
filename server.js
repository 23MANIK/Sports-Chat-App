//getting Starting with required libraries
require("dotenv").config();
const express=require("express");
const http=require('http')
const path=require('path');
const { PASSWORD } = process.env;

const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/ChatApp', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(`mongodb+srv://Niksselfish:${PASSWORD}@cluster0.7jdnu.mongodb.net/ChatApp`, {useNewUrlParser: true, useUnifiedTopology: true});

const socker =require('./socker/index.js');
const app=express();
const server=http.createServer(app);
socker(server);

//setting static path. Path module is used for handling and transforming file paths
app.use(express.static(path.join(__dirname,'public')));
 
// Run server on env port and at local port
const PORT=process.env.PORT||3000;
server.listen(PORT,()=>{
    console.log('server is running on port '+3000);
});