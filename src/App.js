const express=require('express');

const main=express();

const {authadmin}=require("../MiddleWares/authadmin");
const { userauth } = require('../MiddleWares/authuser');




main.use("/admin",authadmin);

main.use("/user",userauth,(req,res)=>
{
res.send("User data send!!!!");
})

main.get("/admin/delete",(req,res)=>
{
res.send("ADMIN DELEETD");
})

main.post("/user/data",(req,res)=>
{
res.send("")
})

main.get("/admin/Data",(req,res)=>
{
res.send("ADMIN DATA RETRIEVED!!!");
})

main.listen(3213,()=>
{
  console.log("Hello from the server!!!!");
})
// just starts the server — doesn't affect middleware matching order