const express=require('express');

const main=express();

main.use("/user",(req,res,next)=>
{
console.log("1st rouite");
next();
// res.send("Sewy 1st!!!!");

},[(req,res,next)=>
{
console.log("2ND ROUTE!!!");
next();
// res.send("2nd SEWY!!!");
},(req,res)=>
{
console.log("3rd Response!!!!");
res.send("3rd SEWY!!!!!");
}])

main.listen(3213,()=>
{
  console.log("Hello from the server!!!!");
})
// just starts the server — doesn't affect middleware matching order