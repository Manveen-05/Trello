const jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
    const token = req.headers.authorization || req.headers.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decodedToken = jwt.verify(token, "secret");
        const userId = decodedToken.userId || decodedToken.id;
        if (userId) {
            req.userId = userId;
            next();
        } else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = {
    authMiddleware: authMiddleware
}