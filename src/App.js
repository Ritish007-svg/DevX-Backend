const express=require('express');

const main=express();
main.use("/home",(req,res)=>
{
res.send("Hare Krishna Hare Rama Jai jai Shri Radhe!!!! from home page");
})


main.use("/test",(req,res)=>
{
res.send("Hare Krishna Hare Rama!!!! from test page");
})

main.use("/hello",(req,res)=>
{
  res.send("Hare Krishna from hello world!!!!");
})
// ✅ WORKS — nothing above it has caught /hello yet
main.use((req,res)=>
{
res.send("Hare Krishna Hare Rama!!!! from main page");
})
// catch-all — matches EVERY path, sends response, no next()
main.use("/hello",(req,res)=>
{
  res.send("Hare Krishna from hello world!!!!");
})

// ❌ NEVER RUNS — the catch-all above already intercepted 
// and responded to /hello first. Has nothing to do with listen(). 
main.listen(3213,()=>
{
  console.log("Hello from the server!!!!");
})
// just starts the server — doesn't affect middleware matching order