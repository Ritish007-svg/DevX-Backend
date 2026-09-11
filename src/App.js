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

//find by Id and delete
main.delete("/del",async(req,res)=>
{
const id=req.body.id;
try{
  if(id.length==0)
  {
    res.send("No id inserted!!!!");
  }
  const response=await User.findByIdAndDelete(id);
  if(!response)
  {
    res.send("Id not found in DB!!!!");
  }
  else
  {
    res.send("User of that id deleted succesfully!!");
  }
}
catch(err)
{

}
})

//getting user by Id 
main.get("/id",async(req,res)=>
{
  const id=req.body.id;
  try{
    if(!id||id.length==0)
    {
      res.send("Aint no id shit!!!");
    }
    const response=await User.findById(id);
   if(!response)
   {
    res.send("No user with that Id");
   }
   else
   {
    res.send(response);
   }
  }
  catch(err)
  {
    res.status(404).send("Some error while finding the id!!!");
  }
})

//updating user 
main.patch("/update",async(req,res)=>
{
  const id=req.body.id;
 try{

  if(id.length==0||!id)
    {
     return res.send("Bullshit pass an id!!!!");
    }    
  const response=await User.findByIdAndUpdate(id,{"firstName":"MOI MOI SIUU","kaabil Ho":"Haa"},{new:false,upsert:true})
  console.log(response);
  res.send(response);
  
 }
 catch(err){
  console.log(err);
  res.status(404).send("Some error while updating!!!!!");
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