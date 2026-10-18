const express=require('express');

const cookieParser = require('cookie-parser');
const cors = require('cors');
require("dotenv").config();


const main=express();

const {connect}=require("../src/config/database");

main.use(cors({
  origin:"http://localhost:5173",
    credentials: true,
}));
main.use(express.json());
main.use(cookieParser());

const authRouter=require("./Routes/auth");
const reqRouter=require("./Routes/requests");
const userProfileRouter=require("./Routes/userProfile");
const passwordRouter=require("./Routes/Passwords");
const userRouter=require("./Routes/userRoutes");


main.use("/",authRouter);
main.use("/",reqRouter);
main.use("/",userProfileRouter);
main.use("/",passwordRouter);
main.use("/",userRouter);


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