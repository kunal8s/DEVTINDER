const express = require("express");

const User = require("../model/user.js");
const { userAuth } = require("../middlewares/auth.js"); // Added destructuring if required by your middleware export

const ConnectionRequest = require("../model/connectionRequest.js")

const USER_SAFE_DATA = "name age";

const userRouter = express.Router();

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


userRouter.get("/feed",userAuth, async (req,res)=>{
    try{

        // user is available to see all user except 
        // 1. its own profile
        // 2. already sent connection -> interested
        // 3. alreadyy in connection -> accepted
        // 4. Ignored or rejected 

        const loggedInUser = req.user;
        
        // NOW WE DIDNOT WANT THAT OUR MILLIONS OF DATA BOMBARD AT SAME TIME IN FEED SO WE USED THE PAGONATION DATA COMES IN CHUNK BY CHUNK 
        // .SKIP() & .LIMIT()

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit; 

        const skip = (page-1)*limit;



        // find all people requested (sent + recieved)
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedInUser._id},{toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");


        // this contains already in connection or connection sent and self ID also  
        const hideUsersFromFeed = new set();
        connectionRequest.forEach(req=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        }) 

        const users = await User.find({
            $and:[
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne:loggedInUser._id}} // for self  
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.send({data: users});


    }catch(err){
        res.status(404).json({message: err.message});
    }
})


module.exports = { userRouter };