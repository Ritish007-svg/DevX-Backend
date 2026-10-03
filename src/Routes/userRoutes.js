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
  }).populate("fromUser","firstName age gender bio skills photoUrl");

  res.json({
    message:"Pending connection requests",
    data:Requests
  })
}
catch(err)
{
res.status(500).send("Error mesaage is here--->"+err.message);
  
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
  }).populate("fromUser","firstName age gender bio skills photoUrl")
  .populate("toUser","firstName age gender bio skills photoUrl")

  if(viewStat.length ==0)
  {
    return res.status(404).send("No connections to view!!!!!");
  }



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
 res.status(500).send("Error mesaage is here--->"+err.message);
}
})




userReq.get("/users/feed",cookieChecker,async(req,res)=>
{
  try{

   
    //dont show his own card 
    //dont show users who have been ignored with a time lapse of 7days 
    //dont show users that have already been accepted or rejected 
    //dont show user requests whom connection requests have been sent 
    // dont show users who have send a connection request to me (pending phase)

    const pageNum=parseInt(req.query.page)||1;
    let limit=parseInt(req.query.limit)||10;
    limit=limit>30?30:limit;
    const skip=(pageNum-1)*limit;
       const WEEK=7*24*60*60*1000;
    const cutoff=new Date(Date.now()-WEEK);

    if(pageNum<=0)
    {
      throw new Error("Invalid page number!!!");
    }

    const LoggedIn=req.userdata;
    const findToAvoid=await connection.find({
      $or:[
        {fromUser:LoggedIn._id},
        {toUser:LoggedIn._id}
      ]
    })


  const hideUsers=new Set();
  findToAvoid.forEach((connection)=>
  {
    if(connection.status=="Ignored"&&connection.fromUser.toString()===LoggedIn._id.toString()&&connection.updatedAt<cutoff)
      {
        return;
      };
    hideUsers.add(connection.fromUser.toString()),
    hideUsers.add(connection.toUser.toString())
  })

const feedUsers=await User.find({
  $and:[
    { _id: { $nin:Array.from(hideUsers)  } },
    {_id:{$ne:LoggedIn._id}}

  ]
}).select("firstName age gender bio skills photoUrl").sort({ _id: 1 }).skip(skip).limit(limit);

res.send(feedUsers);

//Adding pagination
// /feed?page=1&limit=10 ==>1-10 .skip(0) .limit(10)
// /feed?page=2&limit=10 ==>1-20 .skip(10) .limit(10)

  }
  catch(err)
  {
     res.status(500).send("Error mesaage is here--->"+err.message);
  }
})


module.exports=userReq;
