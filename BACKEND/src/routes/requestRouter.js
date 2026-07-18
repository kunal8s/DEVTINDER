const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../model/user.js");
const requestRouter = express.Router();

requestRouter.post("/request/send/interested/:userid",userAuth,(req, res)=>{
    const user = req.user;

    console.log("Sending a connection request...");
    res.send("Sucessfull");
})

module.exports = {requestRouter}; 