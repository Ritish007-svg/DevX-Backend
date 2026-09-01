const express=require('express');

const main=express();

const {connect}=require("../src/config/database");

const {User}=require("./models/users");

main.use(express.json());

main.post("/signup",async(req,res)=>
{
const user= new User(req.body);

try{
await user.save();
res.send("User added succesfully!!!!");
}
catch(err)
{
res.status(400).send("Some error occured!!");
}
})

connect().then(()=>
{
  console.log("Database is connected!!!!!");
  
main.listen(3213,()=>
{
  console.log("Hello from the server!!!!");
})
})
.catch((err)=>
{
console.error("ERROR MISLAIGNMENT BRUV!!!",err);
})
                                                                                                                                                                                                    

// just starts the server — doesn't affect middleware matching order