const express=require('express')
const authRouter=express.Router();
const bcrypt=require('bcrypt')
const {validateSignup}=require('../helpers/validators')
const {User}=require("../models/users");
const jwt=require("jsonwebtoken")
const isProd = process.env.NODE_ENV === "production";
//signup
authRouter.post("/signup", async (req, res) => {
  try {
     validateSignup(req);

    const user = new User(req.body);
    user.password = await bcrypt.hash(req.body.password, 10);

    // CHANGED: keep the saved user in a variable
    const savedUser = await user.save();

    // NEW: token + cookie, exactly like login
    const token = await savedUser.getJWT();
    res.cookie("Token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    // CHANGED: savedUser instead of check
    const { password: pass, ...userWithoutPassword } = savedUser.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    console.log(err);
      // NEW: MongoDB's code for "this email already exists"
    if (err.code === 11000) {
      return res.status(400).json({ message: "This email is already registered." });
    }
    res.status(400).json({ message: err.message });
  }
});


//login
authRouter.post("/login",async(req,res)=>
{
  try{
  const {emailId,password}=req.body;
  if(!emailId || !password)
  {
    return res.status(400).json({ message: "Please enter email and password." });
  }

  const check=await User.findOne({emailId}).select("+password");

  if(!check)
  {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  
  const ispasswordValid=await check.validatePassword(password)


    if (!ispasswordValid) {
   return res.status(401).json({ message: "Invalid email or password." });
    }

  // don't send password back, even hashed
  const {password:pass,...UserWithoutPassword}=check.toObject();

  const token=await check.getJWT();
  

  res.cookie("Token",token,
    { expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
    }
    
  )
  


    res.send(UserWithoutPassword)
  }
  catch(err)
  {
    console.error(err);
  res.status(500).json({ message: "Something went wrong. Try again." });
  }
})

authRouter.post("/logout",async(req,res)=>
{
  const token=req.cookies.Token;
  let message="Logged out Succesfully!!!";
  if(token)
  {
    try{
      const verify=jwt.verify(token, process.env.JWT_SECRET);
      const user=await User.findById(verify._id);
      if(user)
      {
      message=`${user.firstName} has logged out succesfully!!!!!`;
      }
    }
    catch(err)
    {
      return res.status(404).send("Error occured while logging out"+err.message);
    }
  }

  res.clearCookie("Token");
  res.send(message);
})

module.exports=authRouter;