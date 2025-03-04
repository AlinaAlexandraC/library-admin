import admin from "../config/firebase.js";

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({message: "Unauthorized: No token provided"})
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next(); 
  } catch (error) {
    return res.status(403).json({message: "Unauthorized: Invalid token"})
  }
};

export default authenticateToken;