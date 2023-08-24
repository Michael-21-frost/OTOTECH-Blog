import mongoose from 'mongoose';
import users from './userSchema'
import articles from './articleSchema'

const commentSchema=new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:users,
    required:true
  },
  page_link:{
    type:String,
    required:true
  },
  pageId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:articles,
    required:true
  },
  comment:{
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
module.exports=mongoose.models.comments || mongoose.model('comments',commentSchema);
