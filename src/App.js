const express=require('express');

const main=express();

// This is the key thing you're missing: main.use() matches ANY HTTP method — GET, POST, DELETE, PUT, everything. It only filters by path, not by method. So main.use("/user", ...) matches:

// GET /user ✅
// POST /user ✅
// DELETE /user ✅

// All of them — because use() doesn't care what method the request used, only that the path matches.


// main.use("/user",(req,res)=>
// {
//   res.send("LALALALA!!!");
// })

main.get("/user",(req,res)=>
{
res.send({"firstname":"Mukunda",
          "lastname":"Murari",
          "authority":"Supreme"
})
console.log("Hulahuu!!!");
})

main.post("/user",(req,res)=>
{
  console.log("Posted in users succesfully!!!!!");
  res.send("Data succesfully posted to DB!!!!");
})

main.delete("/user",(req,res)=>
{
  console.log("Deleted in users succesfully!!!!!");
    res.send("Data succesfully posted to DB!!!!");
})



main.listen(3213,()=>
{
  console.log("Hello from the server!!!!");
})
// just starts the server — doesn't affect middleware matching order