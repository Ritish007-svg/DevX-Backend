const express=require('express')
const userProfile=express.Router();
const {cookieChecker}=require("../../MiddleWares/JWTcookie");
const {validateProfileEdit}=require("../helpers/validators");
const {User}=require("../models/users");
const jwt=require("jsonwebtoken");
userProfile.get("/profile/view",cookieChecker,async(req,res)=>
{
    
    const user=req.userdata;
    res.send(user);
})


userProfile.patch("/profile/update",cookieChecker,async(req,res)=>
{
    try
    {
    if(!validateProfileEdit(req))
    {
        throw new Error("User Input cannot be updated!!!!");
    }

    const loggedIn=req.userdata;
    console.log(loggedIn);
    Object.keys(req.body).forEach((key)=>(loggedIn[key]=req.body[key]));
    console.log(loggedIn);
    await loggedIn.save();
    res.json(
        {
        message:`${loggedIn.firstName} updated succesfully!!!!`,
        data:loggedIn
    })
}
catch(err)
{
return res.status(404).send("Error message"+err.message);
}
})



module.exports=userProfile;