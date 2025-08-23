import { verifyToken } from "../services/tokenService.js";
import User from "../model/user.model.js";
import { generateToken } from "../services/tokenService.js";
import { sendVerificationEmail } from "../services/emailService.js";

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        user.emailVerified = true;
        await user.save();
        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (user.emailVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }
        const token = generateToken(user._id);
        await sendVerificationEmail(email, token);
        return res.status(200).json({ message: "Verification email sent" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}