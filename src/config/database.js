const mongoose=require("mongoose");

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


const connect=async()=>
{
  await mongoose.connect("mongodb+srv://kritish2803_db_user:nNqrOJl5MAsQAJKl@cluster0.7vul77t.mongodb.net/DevTinder");
};

module.exports={connect};

