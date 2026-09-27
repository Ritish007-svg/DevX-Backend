const express=require('express')
const connectionReq=express.Router();
const {cookieChecker}=require("../../MiddleWares/JWTcookie");
const connection=require("../models/connectionreq");
const {User}=require("../models/users");
//sendingConnectionReq
connectionReq.post("/connection",cookieChecker,(req,res)=>
{
const user=req.userdata;
res.send(user.firstName+" sent the connection request!!!!")
})

connectionReq.post("/request/send/:status/:toUserId",cookieChecker,async(req,res)=>
{
  try{
const fromUserId=req.userdata._id;
const toUserId=req.params.toUserId;
const status=req.params.status;

const isAllowed=["Interested","Ignored"];
if(!isAllowed.includes(status))
{
  throw new Error("Invalid status!!!!");
}

const checkConnection=await connection.findOne({
  $or:[
    {fromUser:fromUserId,toUser:toUserId},
    {fromUser:toUserId,toUser:fromUserId}
  ]
});

if(checkConnection)
{
  return res.status(404).send("Connection link already exists between the users!!!!")
}

const validToUser=await User.findById(toUserId);
if(!validToUser)
{
  throw new Error("Reciever is dead!!!");
}



const ConnectionReq=new connection({
   fromUser: fromUserId,
  toUser: toUserId,
  status
});

const data=await ConnectionReq.save();

res.json({
  message:`${req.userdata.firstName} is ${status} in ${validToUser.firstName}`,
  data:data
})
  }
  catch(err)
  {
    res.status(404).send(err.message);
  }

})

module.exports=connectionReq;