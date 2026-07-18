const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
    try {
        const { auth_token } = req.cookies;
        if (!auth_token) {
            throw new Error("Token is missing!");
        }

        // REMOVED 'await' - jwt.verify is synchronous
        const decodedObj = jwt.verify(auth_token, "pappuCAN09@@");

        const { _id } = decodedObj;
        console.log("Looking up user with ID:", _id);

        if (!_id) {
            throw new Error("Invalid token payload configuration");
        }

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User does not exist in collection");
        }

        // Attach the found user directly to the request object
        req.user = user;

        next(); // Safely move to the route handler
    } catch (err) {
        res.status(401).send("ERROR: " + err.message);
    }
};

module.exports = { userAuth };
