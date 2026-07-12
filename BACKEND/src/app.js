const express = require("express");
const app = express(); 

const PORT = 3000; 

app.get("/",(req,res)=>{
    res.end("HELLOOOOOOOOOO");
})


// middleware age and country check
const age_country_check = (req,res,next)=>{
    const {age,country} = req.params;
    if(age>=21 && country=="India"){
        next();
    }
    else{
        res.send({msg:"Unauthorized acess...."})
    }
}

// controller 
const goon = (req,res)=>{
    res.send("WELCOME TO THE GORGE  !!!!!!!!11")
};

app.get("/login/:age/:country",age_country_check,goon);

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



app.get("/checker", (req, res) => {
  try {
    // 1. Trigger your test error here
    throw new Error("TEST_ERROR: hellllooooalalall"); 
  } catch (error) {
    // 2. This will safely log to your terminal
    console.log("Caught test error:", error.message); 
    
    // 3. This sends the error back to your browser/Postman so you see it works
    res.status(500).json({ 
      success: false, 
      message: error.message 
    }); 
  }
});

app.use("/ck",(err,req,res,next)=>{
    if(err){
        res.status(500).send("hj")
    }
})


app.listen(PORT,()=>{
    console.log("Backend service is running fine. ✅🛩️")
}) 


