const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const tokenChecker = async (req,res,next)=>{
  try{
    const tkn = req.cookies.tkn
    if(!tkn){
      console.log("ACCESS TOKEN EXPIRED")
      console.log("CHECKING FOR REFRESH TOKEN")
      const rToken = User.findOne({_id:tkn._id}).select('Rtoken')
      console.log(rToken)
    }
  }catch(error){
    return res.status(500).json({message:'token not verfiyed'})
  }
}

module.exports = { protect, tokenChecker };
