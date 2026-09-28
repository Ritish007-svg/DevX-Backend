const mongoose=require('mongoose');

const ConnectionSchema=new mongoose.Schema({
  "fromUser":{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },

  "toUser":{
    type:mongoose.Schema.Types.ObjectId,
      required:true
  },

  "status":{
      type: String,
    enum: { values: ['Interested', 'Ignored','Accepted','Rejected'],
       message:'{VALUE} is not supported',

  },

  required:true

},
},
{
  timestamps:true,
}
)

ConnectionSchema.pre(("save"),function()
{
  const connectionRequest = this;
if (connectionRequest.fromUser.equals(connectionRequest.toUser)) {
  throw new Error("Cannot send connection request to yourself!");
}
})

ConnectionSchema.index({fromUser: 1, toUser: 1 });

const ConnectionModel=mongoose.model("Connection",ConnectionSchema);

module.exports=ConnectionModel;