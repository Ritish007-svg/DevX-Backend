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

main.get(["/xz","/xyz"],(req,res)=>
{
res.send({"firstname":"Mukunda",
          "lastname":"Murari",
          "authority":"Supreme"
})
console.log("Hulahuu!!!");
})

main.get(/^\/cd+e$/,(req,res)=>
{
res.send({"firstname":"Shyam",
          "lastname":"Ji",
          "authority":"Supreme"
})
console.log("Hulahuu!!!");
})


main.get(/^\/ab.*cd$/, (req, res) => {
    res.send({
        firstName: "Akshay",
        lastName: "Saini"
    });
});


main.get(/ap/, (req, res) => {
    res.send({
        firstName: "Vraja",
        lastName: "Mayapur"
    });
});


main.get(/.*fly$/, (req, res) => {
    res.send({
        firstName: "Jai",
        lastName: " Prabhupada"
    });
});

main.get("/user/:userid/:user_password/:user_info",(req,res)=>
{
  res.send({
        firstName: "Prema",
        lastName: "Love"
    });
    console.log(req.params);
});

main.get("/user",(req, res) => {
    res.send({
        firstName: "Res",
        lastName: "Query"
    });
    console.log(req.query);
});

main.listen(3213,()=>
{
  console.log("Hello from the server!!!!");
})
// just starts the server — doesn't affect middleware matching order