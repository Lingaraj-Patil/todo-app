const jwt = require("jsonwebtoken");
const JWT_SECRET = "s3cret";

function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing or malformed" });
    }

    const token = authHeader.split(" ")[1]; // Extract token

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id; // Assign user ID to request
        next(); // Proceed to the next middleware/route
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
}


module.exports = {
    auth,
    JWT_SECRET
}