const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.decode(token, process.env.JWT_SECRET);

      // Fetch user data from the database to include the role
      const user = await User.findById(decoded.id).select("role"); // Select only `role` field
      if (!user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      // Set user ID and role from the decoded token
      req.user = { id: decoded.id,
         role: user.role
        };

      next();
    } catch (error) {
      console.error("Error verifying token:", error); // Log the error
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = authMiddleware;
