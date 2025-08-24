import User from "../model/user.model.js";
import Role from "../model/roles.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    // req.user is already the full user object from verify middleware
    const role = await Role.findById(req.user.role);

    if (role.level !== 1) {
      return res.status(401).json({ message: "Not Admin" });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
