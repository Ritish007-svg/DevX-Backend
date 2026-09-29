const express=require('express')
const userReq=express.Router();
const {cookieChecker}=require("../../MiddleWares/JWTcookie");
const connection=require("../models/connectionreq");
const {User}=require("../models/users");


//get all the pending connection request for the loggedIn user

userReq.get("/users/requests/pending",cookieChecker,async(req,res)=>
{
try{

  const LoggedIn=req.userdata;
  const Requests=await connection.find({
    toUser:LoggedIn,
    status:"Interested"
  }).populate("fromUser","firstName age gender bio skills PhotoUrl");

  res.json({
    message:"All connection requests have been sent!!!",
    data:Requests
  })
}
catch(err)
{
  res.status(404).send("Error mesaage is here--->",err.message);
  
}
})
module.exports=userReq;
