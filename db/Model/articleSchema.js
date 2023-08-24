import mongoose from 'mongoose';
import staffs from './staffSchema';
import categories from './categorySchema';

const articleSchema=new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  slug:{
    type:String,
    required:true
  },
  categorySlug:{
    type:String,
    required:true
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:categories,
    required:true
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:staffs,
    required:true
  },
  content:{
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
module.exports=mongoose.models.articles || mongoose.model('articles',articleSchema);
