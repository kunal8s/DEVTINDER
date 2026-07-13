const express = require("express");
const morgan = require("morgan");
const User = require("./model/user.js")
const app = express(); 
const connectDB = require("./config/database.js");

const PORT = 3000; 

app.use(express.json());

app.use(morgan("dev")); 

app.get("/",(req,res)=>{
    res.end("HELLOOOOOOOOOO");
})

app.post("/signup",async (req,res)=>{
    const user = new User({
        name:"Kunal sharma",
        emailId:"Kunalsharmakunu09@gmail.com",
        password:"pappuCAN09@",
        age:22
    })

    await user.save();

    res.status(200).send({msg:"User added sucessfully...!!"});
})

connectDB()
    .then(() => {
        console.log("Database connection established... 🔌");
        
        // 2. Start the Express service only after the DB is ready
        app.listen(PORT, () => {
            console.log(`Backend service is running fine on port ${PORT}. ✅🛩️`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed! ❌", err.message);
        process.exit(1); // Stop the application if the DB cannot connect
    });



