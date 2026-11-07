const validator = require("validator");

// CHANGED: no `res` anymore. It only THROWS, and the route's catch sends the reply as JSON.
const validateSignup = (req) => {
  const { emailId, firstName, password, gender } = req.body;

  // CHANGED: friendlier text, and trim() so "   " doesn't count as a name
  if (!firstName?.trim() || !emailId?.trim() || !password) {
    throw new Error("Please fill all the fields.");
  }

  // NEW: gender is required and must be one of the three allowed values
  if (!["male", "female", "others"].includes(gender)) {
    throw new Error("Please select a gender.");
  }

  // NEW: email check (the rubbish email in your screenshot stops here)
  if (!validator.isEmail(emailId)) {
    throw new Error("Please enter a valid email address.");
  }

  // CHANGED: throws instead of res.send
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password needs at least 8 characters with uppercase, lowercase, a number and a symbol."
    );
  }
};



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
