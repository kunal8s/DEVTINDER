const mongoose = require("mongoose");
const {Schema} = mongoose;

const UserSchema = new Schema({
    name : {
        type:String,
        required: [true, "Name is required"],
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    emailId:{
        type:String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    }, 
    password:{
        type:String
    }, 
    age:{
        type:Number
    } 
})

const UserModel = mongoose.model("User",UserSchema);
module.exports = UserModel;