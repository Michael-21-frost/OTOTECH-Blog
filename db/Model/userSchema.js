import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
  full_name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  day:{
    type:String,
    required:true,
    immutable:true
  },
  month:{
    type:String,
    required:true,
    immutable:true
  },
  year:{
    type:String,
    required:true,
    immutable:true
  }  
})


//---------------------------------------------------
module.exports=mongoose.models.users || mongoose.model('users',userSchema);
