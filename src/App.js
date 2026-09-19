const express=require('express');

const bcrypt=require('bcrypt')
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

const main=express();
const validator=require('validator')
const {validateSignup}=require('./helpers/validators')

const {connect}=require("../src/config/database");

const {User}=require("./models/users");

main.use(express.json());
main.use(cookieParser());

//signup

main.post("/signup",async(req,res)=>
{
const user= new User(req.body);

try{
  validateSignup(req,res)
  const hashedPassword=await bcrypt.hash(req.body.password,10);
  console.log(hashedPassword)
  user.password = hashedPassword;
await user.save();  // Step E — 🔴 THIS is the only line where Mongoose validators run
res.send("User added succesfully!!!!");
}
catch(err)
{
  console.log(err)
 res.status(400).send(err.message);
}
})

//login
main.post("/login",async(req,res)=>
{
  try{
  const {emailId,password}=req.body;
  if(!emailId || !password)
  {
    return res.send("Bastard enter your bloody credentials!!!")
  }

  const check=await User.findOne({emailId}).select("+password");

  if(!check)
  {
    return res.status(400).send("Invalid credentials");
  }

  
  const isMatch=await bcrypt.compare(password,check.password);


    if (!isMatch) {
      return res.status(400).send("Password did not match!!!!");
    }

  // don't send password back, even hashed
  const {password:pass,...UserWithoutPassword}=check.toObject();

  const token=jwt.sign({_id:check._id},"DevX$123")
  
  console.log("Token::",token)
  res.cookie("Token",token)
  


    res.send(UserWithoutPassword)
  }
  catch(err)
  {
    res.status(404).send(err.message);
  }
})

// cookieCheck

main.get("/cookieCheck",async(req,res)=>
{
    const cookie=req.cookies.Token;
    if(!cookie)
    {
      throw new Error("Token is not present!!!!")
    }
    //Validating Token
    const tokenVerification=jwt.verify(cookie,"DevX$123")
    const {_id}=tokenVerification;
    console.log("Logged In User is"+_id);

    const user=await User.findById(_id);
    if(!user)
    {
      throw new Error("User not present in DB!!!!!");
    }
    res.send(user);
})


//updating user 
main.patch("/update/:userId",async(req,res)=>
{
  const data=req.params?.userId;
 try{
  

  if(!data)
    {
     return res.send("Bullshit pass an id!!!!");
    }    

    if (req.body.skills && req.body.skills.length > 10) {
      return res.status(400).send("Max 10 skills allowed");
    }

  const response=await User.findByIdAndUpdate(data,{"firstName":req.body.firstName,
    "gender":req.body.gender,
    "skills":req.body.skills,
    "bio":req.body.bio,
    "photoUrl":req.body.photoUrl,
    "age":req.body.age},
    {new:true,
      upsert:true,
      runValidators:true,
      })
  console.log(response);
      
  res.send(response);
  
 }
 catch(err){
  console.log(err);
  res.status(404).send(err.message);
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