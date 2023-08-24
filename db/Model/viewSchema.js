import mongoose from 'mongoose';
import articles from '../Model/articleSchema'

const viewSchema=new mongoose.Schema({
  page_link:{
    type:String,
    required:true
  },
  pageId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:articles,
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
module.exports=mongoose.models.views || mongoose.model('views',viewSchema);
