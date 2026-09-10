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

//Getting one user data first

main.get("/user",async(req,res)=>
{
    const Useremail=req.body.emailId;
  try{
  const user=await User.find({emailId:Useremail});
  if(user.length===0)
  {
    res.status(404).send("User Not found!!!!!");
  }
  else
  {
  res.send(user);
  }
  }
  catch(err)
  {
      res.status(400).send("Some shitthousery!!!");
  }
})

//Getting one userdata
main.get("/one",async(req,res)=>
{
const mail=req.body.emailId;
try{
const response=await User.findOne({emailId:mail}); //matches the emailId with the mail send from postman body
// whereas in case of findOne({}) it does not care about the mail it just returns the first user document
if(!response)
{
  res.send("User not present in DB!!!");
}
if(mail.length==0)
{
  res.send("No user input!!!");
}
else
{
  res.send(response);
}
}
catch(err)
{
  res.status(404).send("Some error occured!!!");
}
})

//FEED url getting all the users signed in our database

main.get("/feed",async(req,res)=>
{
try{
const allUsers=await (User.find({}))
res.send(allUsers);
}
catch(err)
{
  res.status(400).send("Some shitthousery!!!");
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