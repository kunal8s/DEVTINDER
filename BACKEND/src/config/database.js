const mongoose = require("mongoose");

async function connectDB() {
    await mongoose.connect("mongodb+srv://kunu:pappuCAN09@mongoharkirat.ilumvio.mongodb.net/DEVTINDER");
}

module.exports = connectDB;
