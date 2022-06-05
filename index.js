const express = require('express');
const mongoose = require('mongoose');

//app initialization
const app = express();
app.use(express.json());

//mongoose connection
mongoose.connect("mongodb://localhost:27017/students", (err)=>{
    if(err) console.log(err);
    else console.log("Connection successfull");
});

app.listen(3000, (req, res)=>{
    console.log("Server running");
});

app.get("/", (req, res)=>{
    res.json({server: "running"});
})

const api = require('./api/api');
app.use("/api",api);
