const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    emailId: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },
    password: {
        type: String
    },
    age: {
        type: Number
    }
});

UserSchema.methods.getJWT = async function () {
    const user = this;

    const auth_token = await jwt.sign({ _id: this._id }, "pappuCAN09@@", { expiresIn: '2h' });

    return auth_token;
};

UserSchema.methods.validatePassword = async function (passwordByUser) {
    const user = this;
    const hashedPassword = user.password;

    const isPasswordValid = await bcrypt.compare(passwordByUser, hashedPassword);

    return isPasswordValid;
};

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;