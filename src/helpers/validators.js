const validator=require('validator')

const validateSignup=(req,res)=>
{
const {emailId,firstName,password}=req.body
if(!firstName||!emailId||!password)
{
  throw new Error("Insuffciient credentials to signup!!!")
}
 if (!validator.isStrongPassword(password)) {   // ✅ checked here — password is still PLAIN TEXT
    return res.status(400).send("Please enter a strong password");
  }

  if(!(password.length>2 && password.length<=10))
{
  return res.status(400).send("Password ranges between 2 and 10!!!");
}

}



const validateProfileEdit=(req)=>
{
  const queries=["firstName","lastName","skills","bio","photoUrl","gender","age"];

  const input=req.body;

  const allowed=Object.keys(input).every((key)=>queries.includes(key));
  

  return allowed;
}
module.exports={
  validateSignup,
  validateProfileEdit
}
