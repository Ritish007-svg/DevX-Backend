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

userReq.get("/users/requests/status",cookieChecker,async(req,res)=>
{
  try{
  const LoggedIn=req.userdata;

  const viewStat=await connection.find({
   $or:[
    {fromUser:LoggedIn,status:"Accepted"},
    {toUser:LoggedIn,status:"Accepted"}
   ]
  }).populate("fromUser","firstName age gender bio skills PhotoUrl")
  .populate("toUser","firstName age gender bio skills PhotoUrl")

  if(!viewStat)
  {
    return res.status(404).send("No connections to view!!!!!");
  }

  console.log(viewStat);

  const info=viewStat.map((row)=>
  {
    if(row.fromUser._id.toString()===LoggedIn._id.toString())
    {
      return row.toUser;
    }
    else
    {
      return row.fromUser;
    }
  })


  res.json({
    message:"All connections shown of "+LoggedIn.firstName, //how to show the name of the Loggedin user
    data:info
  })
}
catch(err)
{
   res.status(404).send("Error mesaage is here--->",err.message);
}
})
module.exports=userReq;
