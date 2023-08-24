import mongoose from 'mongoose'



const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect () {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  console.log('Connected to mongoDB Cache');
  return cached.conn
}

export default dbConnect;


// mongoose.connect(process.env.db_URL,
// 	{useNewUrlParser:true,useUnifiedTopology:true},(err,res)=>{
// 		if (err) {
// 			console.log("Mongo Err "+err)
// 		}else{


// 		}
// })