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


//Ignored or Interested

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


//Only if Interetsed then accepted or rejected
connectionReq.post("/request/review/:status/:requestId",cookieChecker,async(req,res)=>
{
  

  // Validate the status 
  // LoggedIn User 
  // Ritish-->Other person
  // status Interested 
  // request Id valid\
try{
  const {requestId}=req.params;
  // Normalize case so "accepted" / "ACCEPTED" -> "Accepted"
  const raw=req.params.status;
  const status=raw.charAt(0).toUpperCase()+raw.slice(1).toLowerCase();
  const LoggedIn=req.userdata;
  const allowedStatus=["Accepted","Rejected"];
  if(!allowedStatus.includes(status))
  {
    throw new Error("Invalid request!!!!");
  }

  const validConnection=await connection.findOne({
    _id:requestId,
    toUser:LoggedIn._id,
    status:"Interested"
  })

  if(!validConnection)
  {
    const any=await connection.findById(requestId);
    let reason="No connection exists with this id.";
    if(any)
    {
      if(String(any.toUser)!==String(LoggedIn._id))
        reason=`You are not the receiver. This request is for toUser=${any.toUser}, but you are logged in as ${LoggedIn._id}. Log in as the receiver.`;
      else
        reason=`Status is "${any.status}", not "Interested".`;
    }
    return res.status(404).send("Connection Invalid: "+reason);
  }

  validConnection.status=status;
  const data=await validConnection.save();
  res.json({
    message:"Connection request "+status,
    data:data
  })
}
  catch(err)
  {
      res.status(404).send(err.message);
  }
})

module.exports=connectionReq;