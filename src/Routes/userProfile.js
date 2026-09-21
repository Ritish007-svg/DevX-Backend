const express=require('express')
const userProfile=express.Router();
const {cookieChecker}=require("../../MiddleWares/JWTcookie");

userProfile.get("/profile",cookieChecker,async(req,res)=>
{
    
    const user=req.userdata;
    res.send(user);
})

module.exports=userProfile;