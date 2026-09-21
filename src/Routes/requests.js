const express=require('express')
const connectionReq=express.Router();
const {cookieChecker}=require("../../MiddleWares/JWTcookie");

//sendingConnectionReq
connectionReq.post("/connection",cookieChecker,(req,res)=>
{
const user=req.userdata;
res.send(user.firstName+" sent the connection request!!!!")
})



module.exports=connectionReq;