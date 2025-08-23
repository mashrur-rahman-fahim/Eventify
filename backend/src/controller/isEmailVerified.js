import User from "../model/user.model.js";

export const isEmailVerified = async (req, res) => {
    try {
        const {email}=req.body;
        const user=await User.findOne({email});

        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        if(!user.emailVerified){
            return res.status(200).json({message:"Email not verified",success:false});
        }
        return res.status(200).json({message:"Email verified",success:true});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}