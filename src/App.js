const express=require('express');

const main=express();

const {connect}=require("../src/config/database");

const {User}=require("./models/users");

main.post("/signup",async (req,res)=>
{
  const applicant={
    firstName:"Rama",
    lastName:"Hari",
    gender:"Male",
    age:19,
    emailId:"krishna@gmail.com",
    password:"12345987"
  }
  //creating a new instance of the user model
  const user= new User(applicant);

  try{
  await user.save();
  res.send("User added succesfully!!!");
  }
  catch(err)
  {
    res.status(400).send("Soem error man!!!");
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