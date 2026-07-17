const jwt = require("jsonwebtoken");
const User = require("../model/user"); 

const userAuth = async (req, res, next) => {
    try {
        const { auth_token } = req.cookies;
        if (!auth_token) {
            throw new Error("Token is missing!");
        }

        // 1. Verify the signature matches
        const decodedObj = await jwt.verify(auth_token, "pappuCAN09@@");

        // 2. Safely extract the userId from the payload
        const { userId } = decodedObj;

        // Debug checkpoint: verify the ID is actually printing correctly to your console
        console.log("Looking up user with ID extracted from JWT payload:", userId);

        if (!userId) {
            throw new Error("Invalid token payload configuration");
        }

        // 3. Query the database using mongoose findById helper
        const user = await User.findById(userId);
        
        if (!user) {
            throw new Error("User structure matched but ID does not exist in collection");
        }

        // Attach user to req object for clean route consumption
        req.user = user; 
        
        next();
    } catch (err) {
        res.status(401).send("ERROR: " + err.message);
    }
};

module.exports = {
    userAuth
};
 