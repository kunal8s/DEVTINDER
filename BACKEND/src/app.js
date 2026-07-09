const express = require("express");
const app = express(); 

const PORT = 3000; 

app.use("/test",(req,res)=>{
    res.end("YOUR BACKEND API IS RUNNING...");
}) 


app.listen(PORT,()=>{
    console.log("Backend service is running fine. ✅🛩️")
}) 
