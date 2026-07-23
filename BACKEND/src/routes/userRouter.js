const express = require("express");

const User = require("../model/user.js");
const { userAuth } = require("../middlewares/auth.js"); // Added destructuring if required by your middleware export

const ConnectionRequest = require("../model/connectionRequest.js")

const USER_SAFE_DATA = "name age";

const userRouter = express.Router();

// GET ALL THE PENDING CONNECTION REQUEST FOR THE LOGGED IN USER
// GET ALL THE PENDING CONNECTION REQUEST FOR THE LOGGED IN USER
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try { 
        const loggedInUser = req.user;
        
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);
        
        res.json({
            message: "Data fetched successfully",
            data: connectionRequest
        });
    } catch (error) {
        res.status(500).send("ERROR: " + error.message);
    }
});

userRouter.get("/user/connections",userAuth, async (req,res)=>{
    try{
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);

        // IMP CORNER CASE

        const data = connectionRequest.map((row)=> {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId
            }

            return row.fromUserId
        });

        res.json({data });
    }catch(err){
        res.status(404).send("ERROR : "+err.message);
    }
})


module.exports = { userRouter };
