const blackList = require("../blackList");
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send("Authorization header is missing");
        }
        
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send("Token is not found");
        }

        // Check if the token is in the blacklist
        if (blackList.includes(token)) {
            return res.status(401).send("Please login again!");
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).send("Token is invalid");
        }

        // Token is valid, proceed to the next middleware
        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = auth;
