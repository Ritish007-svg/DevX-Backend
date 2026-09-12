const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
  firstName:
  {
    type:String,
    required:true,
    minLength:2,
    maxLength:50
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
    trim:true
  },
  password:{
    type: String,
    required:true,
    minlength:6,
    maxLength:12,
    unique:true
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

    default:"https://www.vecteezy.com/vector-art/53406424-person-gray-photo-placeholder-man-on-gray-background-avatar-man-icon-anonymous-user-male-no-photo-web-template-default-user-picture-for-social-networks-social-media-resume-forums"
  },

  bio:{
    type:String,
    default:"I am a hardly working person",
    maxLength:500
  },

  skills:{
    type:[String],

  }
},
{
  timestamps:true,
}
);

const User=mongoose.model("User",userSchema);

module.exports={User};