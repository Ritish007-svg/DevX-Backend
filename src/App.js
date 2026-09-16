const express=require('express');

const bcrypt=require('bcrypt')

const main=express();
const validator=require('validator')

const {connect}=require("../src/config/database");

const {User}=require("./models/users");

main.use(express.json());

//signup

main.post("/signup",async(req,res)=>
{
const user= new User(req.body);

  if (!validator.isStrongPassword(req.body.password)) {   // ✅ checked here — password is still PLAIN TEXT
    return res.status(400).send("Please enter a strong password");
  }


if(!(req.body.password.length>2 && req.body.password.length<=10))
{
  return res.status(400).send("Password ranges between 2 and 10!!!");
}


try{
  const hashedPassword=await bcrypt.hash(req.body.password,10);
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
  res.send(UserWithoutPassword)
  }
  catch(err)
  {
    res.status(404).send(err.message);
  }
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