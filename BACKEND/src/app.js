const express = require("express");
const app = express(); 

const PORT = 3000; 

app.get("/",(req,res)=>{
    res.end("HELLOOOOOOOOOO");
})


const rh3 = (req,res)=>{
    console.log("external rote 3///")
}

app.get("/check",(req,res,next)=>{
    console.log("HELLO FROM SERVER REQUEST 2");
    // res.send("Response 2....")
    next();
},(req,res,next)=>{
    console.log("HELLO FROM SERVER REQUEST 1");
    res.send("Response 1...."),
    next();
},rh3)

app.get("/test/:name/:age",(req,res)=>{
    const {name,age} = req.params;
    console.log(name);
    console.log(age);
    res.send({firstname:name,age:age});
}) 


app.listen(PORT,()=>{
    console.log("Backend service is running fine. ✅🛩️")
}) 

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
