const jwt=require("jsonwebtoken")

const {User}=require("../src/models/users");

require("dotenv").config();
const cookieChecker=async(req,res,next)=>
{
  try{
  const {Token}=req.cookies;
  if(!Token)
  {
    throw new Error("Token aint there!!!!")
  }

// CHANGED: reads the secret from .env instead of writing it in the code
const decode=await jwt.verify(Token,process.env.JWT_SECRET);
  const {_id}=decode;

  const userdet=await User.findById(_id);
  if(!userdet)
  {
    throw new Error("No User present in DB !!!!!!");
  }
  req.userdata=userdet;
  next();
}
catch(err)
{
  res.status(400).send("Err as displayed"+err.message)
}

};

module.exports={
  cookieChecker
}