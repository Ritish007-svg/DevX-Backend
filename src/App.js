const express=require('express');

const bcrypt=require('bcrypt')
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

const main=express();
const validator=require('validator')
const {cookieChecker}=require("../MiddleWares/JWTcookie")
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

  const token=jwt.sign({_id:check._id},"DevX$123",{expiresIn:"1d"})
  
  console.log("Token::",token)
  res.cookie("Token",token,
    { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) }
    
  )
  


    res.send(UserWithoutPassword)
  }
  catch(err)
  {
    res.status(404).send(err.message);
  }
})

// cookieCheck

main.get("/profile",cookieChecker,async(req,res)=>
{
    
    const user=req.userdata;
    res.send(user);
})

//sendingConnectionReq
main.post("/connection",cookieChecker,(req,res)=>
{
const user=req.userdata;
res.send(user.firstName+" sent the connection request!!!!")
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