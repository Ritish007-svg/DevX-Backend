const express=require('express')
const authRouter=express.Router();
const bcrypt=require('bcrypt')
const {validateSignup}=require('../helpers/validators')
const {User}=require("../models/users");
const jwt=require("jsonwebtoken")
//signup

authRouter.post("/signup",async(req,res)=>
{
const user= new User(req.body);

try{
  validateSignup(req,res)
  const hashedPassword=await bcrypt.hash(req.body.password,10);
  console.log(hashedPassword)
  user.password = hashedPassword;
await user.save();  // Step E — 🔴 THIS is the only line where Mongoose validators run
res.send("User added succesfully!!!!");
}
catch(err)
{
  console.log(err)
 res.status(400).send(err.message);
}
})


//login
authRouter.post("/login",async(req,res)=>
{
  try{
  const {emailId,password}=req.body;
  if(!emailId || !password)
  {
    return res.send("Bastard enter your bloody credentials!!!")
  }

  const check=await User.findOne({emailId}).select("+password");

  if(!check)
  {
    return res.status(400).send("Invalid credentials");
  }

  
  const ispasswordValid=await check.validatePassword(password)


    if (!ispasswordValid) {
      return res.status(400).send("Password did not match!!!!");
    }

  // don't send password back, even hashed
  const {password:pass,...UserWithoutPassword}=check.toObject();

  const token=await check.getJWT();
  
  console.log("Token::",token)
  res.cookie("Token",token,
    { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) }
    
  )
  


    res.send(UserWithoutPassword)
  }
  catch(err)
  {
    res.status(404).send(err.message);
  }
})

authRouter.post("/logout",async(req,res)=>
{
  const token=req.cookies.Token;
  let message="Logged out Succesfully!!!";
  if(token)
  {
    try{
      const verify=jwt.verify(token,"DevX$123");
      const user=await User.findById(verify._id);
      if(user)
      {
      message=`${user.firstName} has logged out succesfully!!!!!`;
      }
    }
    catch(err)
    {
      return res.status(404).send("Error occured while logging out"+err.message);
    }
  }

  res.clearCookie("Token");
  res.send(message);
})

module.exports=authRouter;