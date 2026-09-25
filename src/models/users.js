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

    default:"https://www.vecteezy.com/vector-art/53406424-person-gray-photo-placeholder-man-on-gray-background-avatar-man-icon-anonymous-user-male-no-photo-web-template-default-user-picture-for-social-networks-social-media-resume-forums",

    validate(value)
    {
      if(!validator.isURL(value))
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
  
    const token=jwt.sign({_id:user._id},"DevX$123",{expiresIn:"1d"});
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