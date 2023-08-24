import mongoose from 'mongoose';

const supportSchema=new mongoose.Schema({
  phone_number:{
   status:{
    type:String,
    required:true
   },
   link:String
  },
  gmail:{
    status:{
     type:String,
     required:true
    },
    link:String
   },
  linkedin:{
  status:{
    type:String,
    required:true
  },
  link:String
  },
  whatsapp:{
    status:{
     type:String,
     required:true
    },
    link:String
   },
  facebook:{
    status:{
     type:String,
     required:true
    },
    link:String
   },
  google_chat:{
    status:{
     type:String,
     required:true
    },
    link:String
   },
})


//---------------------------------------------------
module.exports=mongoose.models.supports || mongoose.model('supports',supportSchema);
