const validator=require('validator')

const validateSignup=(req)=>
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


module.exports={
  validateSignup
}
