const authadmin=(req,res,next)=>
{
const token="xyz";
const isAdminauthorized=token==="xyz";
if(!isAdminauthorized)
{
  res.status(401).send("You are not eligible to fetch this data--------You are unworthy!!!!");
}
else
{
  next();
}
}

module.exports={authadmin};