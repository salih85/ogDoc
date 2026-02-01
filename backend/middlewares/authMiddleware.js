const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      console.log("Auth Middleware: Access Token Received:", token.substring(0, 15) + "...");

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Auth Middleware: Token Verified. User ID:", decoded.userId);

      // Get user from the token
      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      console.log("Auth Middleware: Token Verification Failed:", error.message);
      res.status(401).json({ message: "Not authorized" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
