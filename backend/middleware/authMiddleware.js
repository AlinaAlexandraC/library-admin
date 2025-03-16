import admin from "../config/firebase.js";
import Session from "../models/Session.js";

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    const session = await Session.findOne({ firebaseUid: decodedToken.uid, token });

    if (!session) {
      return res.status(403).json({ message: "Session expired or invalid" });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authenticateToken;