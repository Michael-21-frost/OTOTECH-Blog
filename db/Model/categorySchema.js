import mongoose from 'mongoose';

const categSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  slug:{
    type:String,
    required:true
  },
  description:{
    type:String,
  },
  icon:{
    type:String,
    required:true
  },
  img:{
    public_id:{
      type:String,
      required:true
    },
    url:{
      type:String,
      required:true
    }
  },
  status:{
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
module.exports=mongoose.models.categories || mongoose.model('categories',categSchema);
