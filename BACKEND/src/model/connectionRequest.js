const mongoose = require("mongoose");

const {Schema} = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
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


const connectionRequestModel = mongoose.model("connectionRequest",connectionRequestSchema);

module.exports = connectionRequestModel;
