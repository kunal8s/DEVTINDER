const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../model/user.js");
const ConnectionRequest = require("../model/connectionRequest.js")
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userid",userAuth,async (req, res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.userid;

        const status = req.params.status;

        const allowedStatus = ["interested","ignore"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type: "+status});
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({
            message:"Connection request sent sucessfully.",
            data
        });

    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})

module.exports = {requestRouter}; 