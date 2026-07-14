const express = require("express");
const {z} = require("zod");
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const User = require("./model/user.js")
const app = express(); 
const connectDB = require("./config/database.js");

const PORT = 3000; 

app.use(express.json()); // for reading the json data 

app.use(express.urlencoded({extended:true}));

app.use(morgan("dev")); 

const signupSchema = z.object({
    username:z.string().min(3,"Username must be atleast 3 charecter long").max(20),
    email:z.string().email("Enter the valid email."),
    Password:z.string().min(6,"Password length must be atleast 6"),
    Age:z.number().min(18,"You must be atleast 18 years old").max(120).optional()
})


const loginSchema = z.object({
    email:z.string().email("Enter the valid email."),
    Password:z.string().min(6,"Password length must be atleast 6")
})


app.get("/",(req,res)=>{
    res.end("HELLOOOOOOOOOO");
})

app.post('/signup', async (req, res) => { 
  try {
    // Validate req.body against the schema
    const validatedData = signupSchema.parse(req.body);

    // Destructure validated data
    const { username, email, Password, Age } = validatedData;

    const hashedPassword = await bcrypt.hash(Password,10);

    const user = new User({ 
      name: username, 
      emailId: email, 
      password: hashedPassword, 
      age: Age 
    }); 

    await user.save(); 
    
    res.status(200).send({ msg: "User added successfully...!!" }); 
    console.log(JSON.stringify(validatedData)); 

  } catch (error) {
    // Catch Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        msg: "Validation failed", 
        errors: error.issues.map(err => ({
          field: err.path[0],
          message: err.message
        }))
      });
    }

    // Catch general database or server errors
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
}); 





app.get("/all",async (req,res)=>{
    const users = await User.find().select("-password");
    res.json({
        user:users
    })

})

app.post("/login", async (req, res) => {
    try {
        // 1. Zod validation (will safely step into catch block if validation fails)
        const loginValidate = loginSchema.parse(req.body);
        const { email, Password } = loginValidate;
        
        // 2. Database search
        const users = await User.findOne({ emailId: email });
        
        if (!users) {
            return res.status(401).json({ msg: "Please check the email or kindly signup" });
        }

        // 3. Password check
        const isPasswordMatch = await bcrypt.compare(Password, users.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        // 4. Construct safe payload
        const userinfo = {
            id: users._id,
            name: users.name,
            emailId: users.emailId,
            age: users.age
        };

        res.json({
            USER: userinfo
        });

    } catch (error) {
        // Handle Zod validation errors gracefully without crashing the server
        if (error instanceof z.ZodError) {
            return res.status(400).json({ 
                msg: "Validation failed", 
                errors: error.issues.map(err => ({
                    field: err.path[0],
                    message: err.message
                }))
            });
        }

        // Handle structural or database errors
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});


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








    // signup , login , zod , bcrypt 