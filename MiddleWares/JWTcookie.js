const jwt=require("jsonwebtoken")

const {User}=require("../src/models/users");

const cookieChecker=async(req,res,next)=>
{
  try{
  const {Token}=req.cookies;
  if(!Token)
  {
    throw new Error("Token aint there!!!!")
  }

  const decode=await jwt.verify(Token,"DevX$123");
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