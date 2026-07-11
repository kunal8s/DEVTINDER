const express = require("express");
const app = express(); 

const PORT = 3000; 

app.get("/",(req,res)=>{
    res.end("HELLOOOOOOOOOO");
})

app.get("/test/:name/:age",(req,res)=>{
    const {name,age} = req.params;
    console.log(name);
    console.log(age);
    res.send({firstname:name,age:age});
}) 


app.listen(PORT,()=>{
    console.log("Backend service is running fine. ✅🛩️")
}) 
