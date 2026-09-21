const express=require('express');

const cookieParser = require('cookie-parser');

const main=express();

const {connect}=require("../src/config/database");

main.use(express.json());
main.use(cookieParser());

const authRouter=require("./Routes/auth");
const reqRouter=require("./Routes/requests");
const userRouter=require("./Routes/userProfile");

main.use("/",authRouter);
main.use("/",reqRouter);
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