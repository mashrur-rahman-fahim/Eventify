import User from "../model/user.model.js";
import { verifyToken } from "../services/tokenService.js";
import Role from "../model/roles.model.js";
export const verify = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!user.emailVerified) {
      return res.status(401).json({ message: "Email not verified" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const isLoggedIn = async (req, res) => {
  try {
    // req.user is already the full user object from verify middleware
    const role = await Role.findById(req.user.role);

    return res.status(200).json({
      message: "User logged in successfully",
      user: req.user,
      role: role.level,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
