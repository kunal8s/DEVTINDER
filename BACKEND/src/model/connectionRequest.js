const mongoose = require("mongoose");

const {Schema} = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User" // it is like a join in table in mongo DB it is reference to the user collection and now we populate this
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        required:true,
        enum:{
            values : ["ignore","interested","accepted","rejected"],
            message: `{VALUE} iS incorrect status type`
        }
    }
},
{
    timestamps:true
}

);

connectionRequestSchema.index({fromUserId:1 , toUserId:1}); // NOW THE SEARCHING FOR THESE BECOME VERY FAST 

// it is trigger on the time of save methodd is done like whenever you save the connection in DB so basically it is pre save before save 
// it is like a event handler in mongoose schema 
// can do validtions and checks here , logging and monitoring over ehre 

connectionRequestSchema.pre("save", function (next){
    const connectionRequest = this;

    // CHECK IF MY FROM AND TO USER ID ARE SAME 
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself..!!")
    }

    // next(); // if not next then code will not move ahead and data will not be save 

})


const connectionRequestModel = mongoose.model("connectionRequest",connectionRequestSchema);

module.exports = connectionRequestModel;
