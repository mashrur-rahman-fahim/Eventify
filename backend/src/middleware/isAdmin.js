import User from "../model/user.model.js";
import Role from "../model/roles.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const role = await Role.findById(user.role);

    if (role.level !== 1) {
      return res.status(401).json({ message: "Not Admin" });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
