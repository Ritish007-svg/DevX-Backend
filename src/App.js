const express=require('express');

const main=express();



main.use("/user",(req,res)=>
{
  throw new Error("Bleh bleh bleh");
res.send("User data send!!!!");
})

main.use("/",(err,req,res,next)=>
{
  if(err)
  {
    res.status(500).send("Something went wrung!!!!");
  }
})

main.use("/admin",(req,res)=>
{
try{
  throw new Error("Hula hooo!!!!");
  res.send("Aint working!!!");
}
catch(err)
{
  res.status(500).send("Admin error detected...Pls fix!!!!");
}
})

main.listen(3213,()=>
{
  console.log("Hello from the server!!!!");
})
// just starts the server — doesn't affect middleware matching order