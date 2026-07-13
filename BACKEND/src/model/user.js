const mongoose = require("mongoose");
const {Schema} = mongoose;

const UserSchema = new Schema({
    name : {
        type:String
    },
    emailId:{
        type:String
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