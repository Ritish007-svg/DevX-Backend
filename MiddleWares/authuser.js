const userauth=(req,res,next)=>
{
const id="gsap";
const check=id==="abc";
if(!check)
{
  res.status(401).send("Bastard you are not an user!!!! You a bloody scammer!!!");
}
else
{
  next();
}
};

module.exports={userauth};