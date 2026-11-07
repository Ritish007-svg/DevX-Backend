const mongoose=require("mongoose");
const validator=require('validator')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')

const userSchema=new mongoose.Schema({
  firstName:
  {
    type:String,
    required:true,
    minLength:2,
    index:true,
    maxLength:50,
    validate(value)
    {
      if(!validator.isAlpha(value,"en-US",{ignore:" "}))
      {
        throw new Error("First name should only contain letters");
      }
    }
  },

  lastName:
  {
    type:String,
    minLength:2,
    maxLength:70
  },

  emailId:{
    type:String,
    lowercase:true,
    required:true,
    unique:true,
    trim:true,
    validate(value){
      if(!validator.isEmail(value))
      {
        throw new Error("Not an email Id!!!!"+value)
      }
    }
  },
  password:{
    type: String,
    required:true,
  
  },

  age:{
    type:Number,
    min:18,
    max:75
  },

  gender:{
    type:String,
    validate(value)
    {
      if(!["male","female","others"].includes(value))
      {
        throw new Error("Gender Data not Valid!!!!");
      }
    }
  },

  photoUrl:{
    type:String,

    validate(value)
    {
      
      if (!validator.isURL(value, { require_tld: false }))
      {
        throw new Error ("Photo Url is not VALID!!!!"+value)
      }
    }
  },

  bio:{
    type:String,
    default:"I am a hardly working person",
    maxLength:500
  },

  skills:{
    type:[String],
    validate:{
      validator:(arr)=>arr.length<=10,
      message:"Max skills upto 10"
    }
  }
},
{
  timestamps:true,
}
);

userSchema.methods.getJWT=async function()
{
  const user=this;
  
  // CHANGED: signs the token with the secret from .env instead of the old key written in the code
const token=jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
    return token;
}

userSchema.methods.validatePassword=async function(inpPassword)
{
  const user=this;
  const passwordHash=user.password;

  const isMatch=await bcrypt.compare(inpPassword,passwordHash);
  return isMatch;
}

const User=mongoose.model("User",userSchema);

module.exports={User};