const express=require('express')
const Password=express.Router();
const bcrypt=require('bcrypt');
const {User}=require("../models/users");
const jwt=require("jsonwebtoken");
const {cookieChecker}=require("../../MiddleWares/JWTcookie");

Password.patch("/changePassword",cookieChecker,async(req,res)=>
{
  try{
  const {oldPassword,newPassword}=req.body;
  if(!oldPassword||!newPassword)
  {
    return res.send("Send your credentials to chnage password!!!!!");
  }
  const user=req.userdata;

  const ispasswordValid=await user.validatePassword(oldPassword);
  if(!ispasswordValid)
  {
    throw new Error("Passowrd did not match!!!");
  }

  console.log(user.password);
  user.password=await bcrypt.hash(newPassword,10);
   await user.save();

   console.log(user.password);
    res.send("Password changed successfully");
}
catch(err)
{
return res.status(404).send("Error message"+err.message);
}
})


Password.post("/forgotPassword",async(req,res)=>
{
    try{
const {emailId}=req.body;
const valid=await User.findOne({emailId});
if(!valid)
{
    throw new Error("Something went wrong!!!!");
}
const resetToken=jwt.sign({_id:valid._id},"DevX$123",{expiresIn:"15m"})
const resetLink = `http://localhost:3213/resetPassword/${resetToken}`;
console.log(resetLink);
 res.send("If that email exists, a reset link has been sent.");
    }
    catch(err)
    {
           res.status(400).send(err.message);
    }
})


Password.patch("/resetPassword/:token",async(req,res)=>
{
    try{
const {token}=req.params;
const {newPassword}=req.body;

const decoded=jwt.verify(token,"DevX$123");
console.log("Decoded Id",decoded._id);
const user=await User.findById(decoded._id);
if(!user)
{
    throw new Error("User not in DB")
}

user.password=await bcrypt.hash(newPassword,10);
await user.save();

res.send("Password updated succesfully!!!!");
    }
    catch(err)
    {
        console.log(err);
         res.status(400).send(err.message);
    }
})


module.exports=Password;