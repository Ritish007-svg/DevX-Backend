const express=require('express')
const userProfile=express.Router();
const {cookieChecker}=require("../../MiddleWares/JWTcookie");
const {validateProfileEdit}=require("../helpers/validators");
const {User}=require("../models/users");
const jwt=require("jsonwebtoken");
userProfile.get("/profile/view", cookieChecker, async (req, res) => {
  // keeps: the logged-in user that cookieChecker found
  const user = req.userdata;
  // ADDED: turn the mongoose document into a plain object we can edit
  const safeUser = user.toObject();
  // ADDED: remove the password hash before sending
  delete safeUser.password;
  // CHANGED: send the safe copy instead of the full document
  res.status(200).json(safeUser);
});


userProfile.patch("/profile/update",cookieChecker,async(req,res)=>
{
    try
    {
    if(!validateProfileEdit(req))
    {
        throw new Error("User Input cannot be updated!!!!");
    }

    const loggedIn=req.userdata;
    Object.keys(req.body).forEach((key)=>(loggedIn[key]=req.body[key]));
    await loggedIn.save();

    // ADDED: turn the mongoose document into a plain object we can edit
const safeUser = loggedIn.toObject();
// ADDED: remove the password hash before sending
delete safeUser.password;

res.json({
  message: `${loggedIn.firstName} updated succesfully!!!!`,
  // CHANGED: send the safe copy instead of the full document
  data: safeUser,
});
}
catch(err)
{
return res.status(404).send("Error message"+err.message);
}
})



module.exports=userProfile;