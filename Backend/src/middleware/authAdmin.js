require('dotenv')
const jwt = require("jsonwebtoken");

const authAdmin = async (req, res, next) => {
  // const token = req.cookies?.token;
  // authAdmin.js
const token = req.cookies?.adminToken;  

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET_KEY);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    console.error("Token error:", error);
    return res.status(403).json({ success: false, message: "Forbidden: Invalid token" });
  }
};

module.exports = authAdmin;