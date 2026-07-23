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

        // Neglect if a person try to send connection request to itself , 
        // we can write logi here but we can do schema logic and schema pre also 

        // PRE is a function in a mongoose schema which pre hook it sis kind of like middleware (study in model file)

        // if(fromUserId===toUserId){

        // }

        // check for not existing in my db the toUserId
        const existingToUserId = await User.findById(toUserId);
        if(!existingToUserId){
            return res.status(400).json({message:"User Not Found"});
        }
        

        // check if there is any existing connection request or not 
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[{fromUserId, toUserId},{fromUserId:toUserId, toUserId:fromUserId}]
        })



        if(existingConnectionRequest){
            res.status(400).send({message:"Connection Request Already Exists !!"})
        }


        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({
    message: req.user.name + " is " + status + " in " + existingToUserId.name, // ✅ FIXED
    data
});


    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res)=>{
    try{
        // logged in user is my req.user done by userauth 
        const loggedInUser = req.user;
        
        const {status, requestId} = req.params;
        
        
        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type: "+status});
        }
        
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            // if a -> b sent to b then the cureent logged in user is reciever is touserid logged in person 
            toUserId : loggedInUser._id,
            status:"interested"
        })

        if(!connectionRequest){
            return res.status(404).json({message:"Connection request not found..!!"})
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({message:"Connection request "+status, data});


        //logged in id should be valid 


    }catch(error){

    }
})

module.exports = {requestRouter}; 