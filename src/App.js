const express=require('express');

const cookieParser = require('cookie-parser');
const cors = require('cors');
require("dotenv").config();


const main=express();

const {connect}=require("../src/config/database");

main.use(cors({
  // Allow the Vite dev server on any localhost port (5173, 5174, ...)
  origin: (origin, callback) => {
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
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

// TEMPORARY: prints the connection string with the password hidden, delete it after checking
// TEMPORARY: prints only the variable names that start with MONGO or JWT, delete it after checking
console.log(Object.keys(process.env).filter((k) => k.startsWith("MONGO") || k.startsWith("JWT")));
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