const express=require('express');

const cookieParser = require('cookie-parser');
const cors = require('cors');
require("dotenv").config();


const main=express();

const {connect}=require("../src/config/database");

// Allowed frontend addresses: your local one, plus any live ones listed in FRONTEND_URL in .env (comma-separated)
const allowedOrigins = ["http://localhost:5173", ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : [])];

main.use(
  cors({
    // Only accept requests coming from the addresses in the list above
    origin: allowedOrigins,
    // Let the browser send and receive the login cookie
    credentials: true,
  })
);
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